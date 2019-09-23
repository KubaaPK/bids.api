import { DeleteDraftOfferHandler } from './delete-draft-offer.handler';
import { CustomerRepository } from '../../../../domain/customer/customer.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { ioCContainer } from '../../../../../../config/ioc-container';
import { EntityManager } from 'typeorm';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DeleteDraftOfferCommand } from './delete-draft-offer.command';
import * as faker from 'faker';
import { Customer } from '../../../../domain/customer/customer';
import { Offer } from '../../../../domain/offer/offer';
import { OfferStatus } from '../../../../domain/offer/offer-status';

describe('Delete Draft Item Handler', () => {
  let handler: DeleteDraftOfferHandler;
  let customerRepository: CustomerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteDraftOfferHandler,
        ...ioCContainer,
        {
          provide: EntityManager,
          useValue: {
            getRepository: jest.fn().mockReturnThis(),
          },
        },
      ],
    }).compile();

    handler = module.get(DeleteDraftOfferHandler);
    customerRepository = module.get(CustomerRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should Delete Draft Item Handler be defined', async () => {
    expect(handler).toBeDefined();
  });

  it('should Customer Repository be defined', async () => {
    expect(customerRepository).toBeDefined();
  });

  it('should throw Internal Server Error Exception if selecting customer from Postgres fails', async () => {
    jest.spyOn(customerRepository, 'findOne').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    await expect(
      handler.execute(
        new DeleteDraftOfferCommand(faker.random.uuid(), faker.random.uuid()),
      ),
    ).rejects.toThrowError(InternalServerErrorException);
  });

  it('should throw Not Found Exception if draft offer with given id does not exist in Postgres', async () => {
    jest.spyOn(customerRepository, 'findOne').mockImplementationOnce(async () =>
      Object.assign(new Customer(), {
        offers: new Promise(resolve =>
          resolve([
            Object.assign(new Offer(), {
              id: faker.random.uuid(),
              status: OfferStatus.IN_ACTIVE,
            }),
          ]),
        ),
      }),
    );

    await expect(
      handler.execute(
        new DeleteDraftOfferCommand(faker.random.uuid(), faker.random.uuid()),
      ),
    ).rejects.toThrowError(NotFoundException);
  });

  it('should throw Internal Server Error Exception if saving updated (with deleted offer) customer to Postgres fails', async () => {
    const existingOfferId = faker.random.uuid();
    jest.spyOn(customerRepository, 'findOne').mockImplementationOnce(async () =>
      Object.assign(new Customer(), {
        offers: new Promise(resolve =>
          resolve([
            Object.assign(new Offer(), {
              id: existingOfferId,
              status: OfferStatus.IN_ACTIVE,
            }),
          ]),
        ),
      }),
    );
    jest.spyOn(customerRepository, 'save').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    await expect(
      handler.execute(
        new DeleteDraftOfferCommand(faker.random.uuid(), existingOfferId),
      ),
    ).rejects.toThrowError(InternalServerErrorException);
  });
});
