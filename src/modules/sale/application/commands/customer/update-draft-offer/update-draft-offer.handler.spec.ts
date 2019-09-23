import { Test, TestingModule } from '@nestjs/testing';
import { UpdateDraftOfferHandler } from './update-draft-offer.handler';
import { CustomerRepository } from '../../../../domain/customer/customer.repository';
import { ioCContainer } from '../../../../../../config/ioc-container';
import { ParameterValidator } from '../../../services/parameter-validator/parameter-validator';
import { CategoryValidator } from '../../../services/category-validator/category-validator';
import { EntityManager } from 'typeorm';
import {
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UpdatedDraftOfferDto } from '../../../dtos/write/offer/updated-draft-offer.dto';
import * as faker from 'faker';
import * as admin from 'firebase-admin';
import { UpdateDraftOfferCommand } from './update-draft-offer.command';
import { Customer } from '../../../../domain/customer/customer';
import { Offer } from '../../../../domain/offer/offer';
import { CategoryRepository } from '../../../../domain/category/category.repository';
import { Category } from '../../../../domain/category/category';
import { CategoryNotFoundException } from '../../../../domain/category/exceptions/category-not-found.exception';
import { Parameter } from '../../../../domain/category/parameter';
import { ParameterType } from '../../../../domain/category/parameter-type.enum';
import { InvalidParameterValueException } from '../../../exceptions/invalid-parameter-value.exception';
import { OfferDescriptionItemType } from '../../../../domain/offer/description/offer-description-item-type';

describe('Update Draft Item Handler', () => {
  let handler: UpdateDraftOfferHandler;
  let customerRepository: CustomerRepository;
  let categoryRepository: CategoryRepository;
  let parameterValidator: ParameterValidator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateDraftOfferHandler,
        ...ioCContainer,
        ParameterValidator,
        CategoryValidator,
        {
          provide: EntityManager,
          useValue: {
            getRepository: jest.fn().mockReturnThis(),
          },
        },
      ],
    }).compile();

    handler = module.get(UpdateDraftOfferHandler);
    customerRepository = module.get(CustomerRepository);
    categoryRepository = module.get(CategoryRepository);
    parameterValidator = module.get(ParameterValidator);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should Update Draft Item Handler be defined', async () => {
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

  it('should throw Internal Server Error Exception if selecting customer from Postgres fails', async () => {
    jest.spyOn(customerRepository, 'findOne').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    const updatedDraftOffer: UpdatedDraftOfferDto = {
      name: 'Updated offer name.',
      customer: {
        uid: faker.random.uuid(),
      } as admin.auth.DecodedIdToken,
    };

    await expect(
      handler.execute(
        new UpdateDraftOfferCommand(faker.random.uuid(), updatedDraftOffer),
      ),
    ).rejects.toThrowError(InternalServerErrorException);
  });

  it('should throw Not Found Exception if offer with given id does not exists in Postgres', async () => {
    jest.spyOn(customerRepository, 'findOne').mockImplementationOnce(async () =>
      Object.assign(new Customer(), {
        offers: new Promise(resolve =>
          resolve([Object.assign(new Offer(), { id: faker.random.uuid() })]),
        ),
      }),
    );

    const updatedDraftOffer: UpdatedDraftOfferDto = {
      name: 'Updated offer name.',
      customer: {
        uid: faker.random.uuid(),
      } as admin.auth.DecodedIdToken,
    };

    await expect(
      handler.execute(
        new UpdateDraftOfferCommand(faker.random.uuid(), updatedDraftOffer),
      ),
    ).rejects.toThrowError(NotFoundException);
  });

  it('should throw Internal Server Error Exception if selecting category from Postgres fails', async () => {
    const existingOfferId: string = faker.random.uuid();
    jest.spyOn(customerRepository, 'findOne').mockImplementationOnce(async () =>
      Object.assign(new Customer(), {
        offers: new Promise(resolve =>
          resolve([Object.assign(new Offer(), { id: existingOfferId })]),
        ),
      }),
    );
    jest.spyOn(categoryRepository, 'findOne').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    const updatedDraftOffer: UpdatedDraftOfferDto = {
      name: 'Updated offer name.',
      customer: {
        uid: faker.random.uuid(),
      } as admin.auth.DecodedIdToken,
      category: ({
        id: faker.random.uuid(),
      } as any) as Category,
    };

    await expect(
      handler.execute(
        new UpdateDraftOfferCommand(existingOfferId, updatedDraftOffer),
      ),
    ).rejects.toThrowError(InternalServerErrorException);
  });

  it('should throw Category Not Found Exception if updated category not exists in Postgres', async () => {
    const existingOfferId: string = faker.random.uuid();
    jest.spyOn(customerRepository, 'findOne').mockImplementationOnce(async () =>
      Object.assign(new Customer(), {
        offers: new Promise(resolve =>
          resolve([Object.assign(new Offer(), { id: existingOfferId })]),
        ),
      }),
    );
    jest
      .spyOn(categoryRepository, 'findOne')
      .mockImplementationOnce(() => undefined);

    const updatedDraftOffer: UpdatedDraftOfferDto = {
      name: 'Updated offer name.',
      customer: {
        uid: faker.random.uuid(),
      } as admin.auth.DecodedIdToken,
      category: ({
        id: faker.random.uuid(),
      } as any) as Category,
    };

    await expect(
      handler.execute(
        new UpdateDraftOfferCommand(existingOfferId, updatedDraftOffer),
      ),
    ).rejects.toThrowError(CategoryNotFoundException);
  });

  it('should throw Unprocessable Entity if updated category is not leaf', async () => {
    const existingOfferId: string = faker.random.uuid();
    jest.spyOn(customerRepository, 'findOne').mockImplementationOnce(async () =>
      Object.assign(new Customer(), {
        offers: new Promise(resolve =>
          resolve([Object.assign(new Offer(), { id: existingOfferId })]),
        ),
      }),
    );
    jest
      .spyOn(categoryRepository, 'findOne')
      .mockImplementationOnce(async () =>
        Object.assign(new Category(), { leaf: false }),
      );

    const updatedDraftOffer: UpdatedDraftOfferDto = {
      name: 'Updated offer name.',
      customer: {
        uid: faker.random.uuid(),
      } as admin.auth.DecodedIdToken,
      category: ({
        id: faker.random.uuid(),
      } as any) as Category,
    };

    await expect(
      handler.execute(
        new UpdateDraftOfferCommand(existingOfferId, updatedDraftOffer),
      ),
    ).rejects.toThrowError(UnprocessableEntityException);
  });

  it('should throw Unprocessable Entity Exception if some properties does not belong to given category', async () => {
    const firstParameterId: string = faker.random.uuid();
    const secondParameterId: string = faker.random.uuid();

    const existingOfferId: string = faker.random.uuid();
    jest.spyOn(customerRepository, 'findOne').mockImplementationOnce(async () =>
      Object.assign(new Customer(), {
        offers: new Promise(resolve =>
          resolve([Object.assign(new Offer(), { id: existingOfferId })]),
        ),
      }),
    );
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

    const updatedDraftOffer: UpdatedDraftOfferDto = {
      name: 'Updated offer name.',
      customer: {
        uid: faker.random.uuid(),
      } as admin.auth.DecodedIdToken,
      category: ({
        id: faker.random.uuid(),
      } as any) as Category,
      parameters: [
        {
          id: faker.random.uuid(),
          name: 'Przekątna ekranu',
          value: '5.60',
          type: ParameterType.FLOAT,
        },
      ],
    };

    await expect(
      handler.execute(
        new UpdateDraftOfferCommand(existingOfferId, updatedDraftOffer),
      ),
    ).rejects.toThrowError(UnprocessableEntityException);
  });

  it('should should Invalid Parameter Value Exception if one of parameter value does not meet requirements', async () => {
    const firstParameterId: string = faker.random.uuid();
    const secondParameterId: string = faker.random.uuid();
    const existingOfferId: string = faker.random.uuid();

    jest.spyOn(customerRepository, 'findOne').mockImplementationOnce(async () =>
      Object.assign(new Customer(), {
        offers: new Promise(resolve =>
          resolve([Object.assign(new Offer(), { id: existingOfferId })]),
        ),
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
                max: 10,
                precision: 2,
              },
            }),
            Object.assign(new Parameter(), { id: secondParameterId }),
          ]),
        ),
      }),
    );
    jest
      .spyOn(parameterValidator, 'validate')
      .mockImplementationOnce(() => false);

    const updatedDraftOffer: UpdatedDraftOfferDto = {
      name: 'Updated offer name.',
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
      handler.execute(
        new UpdateDraftOfferCommand(existingOfferId, updatedDraftOffer),
      ),
    ).rejects.toThrowError(InvalidParameterValueException);
  });

  it('should should throw Unprocessable Entity Exception if one of description sections has more than 2 items', async () => {
    const firstParameterId: string = faker.random.uuid();
    const secondParameterId: string = faker.random.uuid();
    const existingOfferId: string = faker.random.uuid();

    jest.spyOn(customerRepository, 'findOne').mockImplementationOnce(async () =>
      Object.assign(new Customer(), {
        offers: new Promise(resolve =>
          resolve([Object.assign(new Offer(), { id: existingOfferId })]),
        ),
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
                max: 10,
                precision: 2,
              },
            }),
            Object.assign(new Parameter(), { id: secondParameterId }),
          ]),
        ),
      }),
    );
    jest
      .spyOn(parameterValidator, 'validate')
      .mockImplementationOnce(() => true);

    const updatedDraftOffer: UpdatedDraftOfferDto = {
      name: 'Updated offer name.',
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
      handler.execute(
        new UpdateDraftOfferCommand(existingOfferId, updatedDraftOffer),
      ),
    ).rejects.toThrowError(UnprocessableEntityException);
  });

  it('should should throw Internal Server Error Exception if saving updated (with updated draft offer) customer to Postgres fails', async () => {
    const firstParameterId: string = faker.random.uuid();
    const secondParameterId: string = faker.random.uuid();
    const existingOfferId: string = faker.random.uuid();

    jest.spyOn(customerRepository, 'findOne').mockImplementationOnce(async () =>
      Object.assign(new Customer(), {
        offers: new Promise(resolve =>
          resolve([Object.assign(new Offer(), { id: existingOfferId })]),
        ),
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
                max: 10,
                precision: 2,
              },
            }),
            Object.assign(new Parameter(), { id: secondParameterId }),
          ]),
        ),
      }),
    );
    jest
      .spyOn(parameterValidator, 'validate')
      .mockImplementationOnce(() => true);

    const updatedDraftOffer: UpdatedDraftOfferDto = {
      name: 'Updated offer name.',
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
      handler.execute(
        new UpdateDraftOfferCommand(existingOfferId, updatedDraftOffer),
      ),
    ).rejects.toThrowError(InternalServerErrorException);
  });
});
