import { Test, TestingModule } from '@nestjs/testing';
import { CreateDraftOfferHandler } from './create-draft-offer.handler';
import { CustomerRepository } from '../../../../domain/customer/customer.repository';
import { ioCContainer } from '../../../../../../config/ioc-container';
import { EntityManager } from 'typeorm';
import {
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { NewDraftOfferDto } from '../../../dtos/write/offer/new-draft-offer.dto';
import * as faker from 'faker';
import * as admin from 'firebase-admin';
import { CreateDraftOfferCommand } from './create-draft-offer.command';
import { ParameterValidator } from '../../../services/parameter-validator/parameter-validator';
import { Customer } from '../../../../domain/customer/customer';
import { CategoryRepository } from '../../../../domain/category/category.repository';
import { Category } from '../../../../domain/category/category';
import { CategoryNotFoundException } from '../../../../domain/category/exceptions/category-not-found.exception';
import { Parameter } from '../../../../domain/category/parameter';
import { ParameterType } from '../../../../domain/category/parameter-type.enum';
import { InvalidParameterValueException } from '../../../exceptions/invalid-parameter-value.exception';
import { OfferDescriptionItemType } from '../../../../domain/offer/description/offer-description-item-type';

describe('Create Draft Offer Handler', () => {
  let handler: CreateDraftOfferHandler;
  let customerRepository: CustomerRepository;
  let categoryRepository: CategoryRepository;
  let parameterValidator: ParameterValidator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateDraftOfferHandler,
        ParameterValidator,
        ...ioCContainer,
        {
          provide: EntityManager,
          useValue: {
            getRepository: jest.fn().mockReturnThis(),
          },
        },
      ],
    }).compile();

    handler = module.get(CreateDraftOfferHandler);
    customerRepository = module.get(CustomerRepository);
    categoryRepository = module.get(CategoryRepository);
    parameterValidator = module.get(ParameterValidator);
  });

  it('should Create Draft Offer Handler be defined', async () => {
    expect(handler).toBeDefined();
  });

  it('should Customer Repository be defined', async () => {
    expect(customerRepository).toBeDefined();
  });

  it('should Category Repository be defined', async () => {
    expect(categoryRepository).toBeDefined();
  });

  it('should Parameter Validator be defined', async () => {
    expect(parameterValidator).toBeDefined();
  });

  it('should throw Internal Server Error if selecting customer from Postgres fails', async () => {
    jest.spyOn(customerRepository, 'findOne').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    const newDraftOffer: NewDraftOfferDto = {
      id: faker.random.uuid(),
      name: 'Test offer',
      customer: {
        uid: faker.random.uuid(),
      } as admin.auth.DecodedIdToken,
    };

    await expect(
      handler.execute(new CreateDraftOfferCommand(newDraftOffer)),
    ).rejects.toThrowError(InternalServerErrorException);
  });

  it('should throw Internal Server Error Exception if selecting given category from Postgres fails', async () => {
    jest
      .spyOn(customerRepository, 'findOne')
      .mockImplementationOnce(async () => new Customer());
    jest.spyOn(categoryRepository, 'findOne').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    const newDraftOffer: NewDraftOfferDto = {
      id: faker.random.uuid(),
      name: 'Test offer',
      customer: {
        uid: faker.random.uuid(),
      } as admin.auth.DecodedIdToken,
      category: ({
        id: faker.random.uuid(),
      } as any) as Category,
    };

    await expect(
      handler.execute(new CreateDraftOfferCommand(newDraftOffer)),
    ).rejects.toThrowError(InternalServerErrorException);
  });

  it('should throw Category Not Found Exception if category with given id does not exist in Postgres', async () => {
    jest
      .spyOn(customerRepository, 'findOne')
      .mockImplementationOnce(async () => new Customer());
    jest
      .spyOn(categoryRepository, 'findOne')
      .mockImplementationOnce(() => undefined);

    const newDraftOffer: NewDraftOfferDto = {
      id: faker.random.uuid(),
      name: 'Test offer',
      customer: {
        uid: faker.random.uuid(),
      } as admin.auth.DecodedIdToken,
      category: ({
        id: faker.random.uuid(),
      } as any) as Category,
    };

    await expect(
      handler.execute(new CreateDraftOfferCommand(newDraftOffer)),
    ).rejects.toThrowError(CategoryNotFoundException);
  });

  it('should throw Unprocessable Entity Exception if given category is not a leaf', async () => {
    jest
      .spyOn(customerRepository, 'findOne')
      .mockImplementationOnce(async () => new Customer());
    jest
      .spyOn(categoryRepository, 'findOne')
      .mockImplementationOnce(async () =>
        Object.assign(new Category(), { leaf: false }),
      );

    const newDraftOffer: NewDraftOfferDto = {
      id: faker.random.uuid(),
      name: 'Test offer',
      customer: {
        uid: faker.random.uuid(),
      } as admin.auth.DecodedIdToken,
      category: ({
        id: faker.random.uuid(),
      } as any) as Category,
    };

    await expect(
      handler.execute(new CreateDraftOfferCommand(newDraftOffer)),
    ).rejects.toThrowError(UnprocessableEntityException);
  });

  it('should throw Unprocessable Entity Exception if some properties does not belong to given category', async () => {
    const firstParameterId: string = faker.random.uuid();
    const secondParameterId: string = faker.random.uuid();

    jest
      .spyOn(customerRepository, 'findOne')
      .mockImplementationOnce(async () => new Customer());
    jest.spyOn(categoryRepository, 'findOne').mockImplementationOnce(async () =>
      Object.assign(new Category(), {
        leaf: true,
        parameters: new Promise(resolve =>
          resolve([
            Object.assign(new Parameter(), { id: firstParameterId }),
            Object.assign(new Parameter(), { id: secondParameterId }),
          ]),
        ),
      }),
    );

    const newDraftOffer: NewDraftOfferDto = {
      id: faker.random.uuid(),
      name: 'Test offer',
      customer: {
        uid: faker.random.uuid(),
      } as admin.auth.DecodedIdToken,
      category: ({
        id: faker.random.uuid(),
      } as any) as Category,
      parameters: [
        {
          id: '2e7f60b2-5921-4147-831d-c159b1561106',
          name: 'Przekątna ekranu',
          value: '5.60',
          type: ParameterType.FLOAT,
        },
      ],
    };

    await expect(
      handler.execute(new CreateDraftOfferCommand(newDraftOffer)),
    ).rejects.toThrowError(UnprocessableEntityException);
  });

  it('should Invalid Parameter Value Exception if one of parameter value does not meet requirements', async () => {
    const firstParameterId: string = faker.random.uuid();
    const secondParameterId: string = faker.random.uuid();

    jest
      .spyOn(customerRepository, 'findOne')
      .mockImplementationOnce(async () => new Customer());
    jest.spyOn(categoryRepository, 'findOne').mockImplementationOnce(async () =>
      Object.assign(new Category(), {
        leaf: true,
        parameters: new Promise(resolve =>
          resolve([
            Object.assign(new Parameter(), {
              id: firstParameterId,
              restrictions: {
                min: 1,
                max: 10,
                precision: 2,
              },
            }),
            Object.assign(new Parameter(), { id: secondParameterId }),
          ]),
        ),
      }),
    );

    const newDraftOffer: NewDraftOfferDto = {
      id: faker.random.uuid(),
      name: 'Test offer',
      customer: {
        uid: faker.random.uuid(),
      } as admin.auth.DecodedIdToken,
      category: ({
        id: faker.random.uuid(),
      } as any) as Category,
      parameters: [
        {
          id: firstParameterId,
          name: 'Przekątna ekranu',
          value: '12.00',
          type: ParameterType.FLOAT,
        },
      ],
    };

    await expect(
      handler.execute(new CreateDraftOfferCommand(newDraftOffer)),
    ).rejects.toThrowError(InvalidParameterValueException);
  });

  it('should throw Unprocessable Entity Exception if one of description sections has more than 2 items', async () => {
    const firstParameterId: string = faker.random.uuid();

    jest.spyOn(customerRepository, 'findOne').mockImplementationOnce(async () =>
      Object.assign(new Customer(), {
        offers: new Promise(resolve => resolve([])),
      }),
    );

    jest.spyOn(categoryRepository, 'findOne').mockImplementationOnce(async () =>
      Object.assign(new Category(), {
        leaf: true,
        parameters: new Promise(resolve =>
          resolve([
            Object.assign(new Parameter(), {
              id: firstParameterId,
              restrictions: {
                min: 1,
                max: 15,
                precision: 2,
              },
            }),
          ]),
        ),
      }),
    );

    jest
      .spyOn(parameterValidator, 'validate')
      .mockImplementationOnce(() => true);

    const newDraftOffer: NewDraftOfferDto = {
      id: faker.random.uuid(),
      name: 'Test offer',
      customer: {
        uid: faker.random.uuid(),
      } as admin.auth.DecodedIdToken,
      category: ({
        id: faker.random.uuid(),
      } as any) as Category,
      parameters: [
        {
          id: firstParameterId,
          name: 'Przekątna ekranu',
          value: '4.50',
          type: ParameterType.FLOAT,
        },
      ],
      description: {
        sections: [
          {
            items: [
              {
                type: OfferDescriptionItemType.TEXT,
                content: 'Content',
              },
              {
                type: OfferDescriptionItemType.TEXT,
                content: 'Content',
              },
              {
                type: OfferDescriptionItemType.TEXT,
                content: 'Content',
              },
            ],
          },
        ],
      },
    };

    await expect(
      handler.execute(new CreateDraftOfferCommand(newDraftOffer)),
    ).rejects.toThrowError(UnprocessableEntityException);
  });

  it('should throw Internal Server Error Exception if saving updated (with new draft offer) customer to Postgres fails', async () => {
    const firstParameterId: string = faker.random.uuid();

    jest.spyOn(customerRepository, 'findOne').mockImplementationOnce(async () =>
      Object.assign(new Customer(), {
        offers: new Promise(resolve => resolve([])),
      }),
    );

    jest.spyOn(customerRepository, 'save').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    jest.spyOn(categoryRepository, 'findOne').mockImplementationOnce(async () =>
      Object.assign(new Category(), {
        leaf: true,
        parameters: new Promise(resolve =>
          resolve([
            Object.assign(new Parameter(), {
              id: firstParameterId,
              restrictions: {
                min: 1,
                max: 5,
                precision: 2,
              },
            }),
          ]),
        ),
      }),
    );

    jest
      .spyOn(parameterValidator, 'validate')
      .mockImplementationOnce(() => true);

    const newDraftOffer: NewDraftOfferDto = {
      id: faker.random.uuid(),
      name: 'Test offer',
      customer: {
        uid: faker.random.uuid(),
      } as admin.auth.DecodedIdToken,
      category: ({
        id: faker.random.uuid(),
      } as any) as Category,
      parameters: [
        {
          id: firstParameterId,
          name: 'Przekątna ekranu',
          value: '4.50',
          type: ParameterType.FLOAT,
        },
      ],
      description: {
        sections: [
          {
            items: [
              {
                type: OfferDescriptionItemType.TEXT,
                content: 'Content',
              },
              {
                type: OfferDescriptionItemType.TEXT,
                content: 'Content',
              },
            ],
          },
        ],
      },
    };

    await expect(
      handler.execute(new CreateDraftOfferCommand(newDraftOffer)),
    ).rejects.toThrowError(InternalServerErrorException);
  });
});
