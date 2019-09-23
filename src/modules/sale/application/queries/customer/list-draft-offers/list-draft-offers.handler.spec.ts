import { Test, TestingModule } from '@nestjs/testing';
import { CustomerRepository } from '../../../../domain/customer/customer.repository';
import { ListDraftOffersHandler } from './list-draft-offers.handler';
import { ioCContainer } from '../../../../../../config/ioc-container';
import { EntityManager } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { ListDraftOffersQuery } from './list-draft-offers.query';
import * as faker from 'faker';
import { Customer } from '../../../../domain/customer/customer';
import { Offer } from '../../../../domain/offer/offer';
import { ListableDraftOfferDto } from '../../../dtos/read/listable-draft-offer.dto';
import { OfferStatus } from '../../../../domain/offer/offer-status';

describe('List Draft Offers Handler', () => {
  let handler: ListDraftOffersHandler;
  let customerRepository: CustomerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListDraftOffersHandler,
        ...ioCContainer,
        {
          provide: EntityManager,
          useValue: {
            getRepository: jest.fn().mockReturnThis(),
          },
        },
      ],
    }).compile();

    handler = module.get(ListDraftOffersHandler);
    customerRepository = module.get(CustomerRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should List Draft Offers Handler be defined', async () => {
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
      handler.execute(new ListDraftOffersQuery(faker.random.uuid())),
    ).rejects.toThrowError(InternalServerErrorException);
  });

  it('should return an array with draft offers', async () => {
    jest.spyOn(customerRepository, 'findOne').mockImplementationOnce(async () =>
      Object.assign(new Customer(), {
        offers: new Promise(resolve =>
          resolve([
            Object.assign(new Offer(), { status: OfferStatus.IN_ACTIVE }),
            Object.assign(new Offer(), { status: OfferStatus.IN_ACTIVE }),
          ]),
        ),
      }),
    );

    const result: any[] = await handler.execute(
      new ListDraftOffersQuery(faker.random.uuid()),
    );

    expect(Array.isArray(result)).toBeTruthy();
  });

  it('should single array element be an instance of Listable Draft Item Dto', async () => {
    jest.spyOn(customerRepository, 'findOne').mockImplementationOnce(async () =>
      Object.assign(new Customer(), {
        offers: new Promise(resolve =>
          resolve([
            Object.assign(new Offer(), { status: OfferStatus.IN_ACTIVE }),
            Object.assign(new Offer(), { status: OfferStatus.IN_ACTIVE }),
          ]),
        ),
      }),
    );

    const result: ListableDraftOfferDto[] = await handler.execute(
      new ListDraftOffersQuery(faker.random.uuid()),
    );
    expect(result[0]).toBeInstanceOf(ListableDraftOfferDto);
  });

  it('should return only one draft offer (limited)', async () => {
    jest.spyOn(customerRepository, 'findOne').mockImplementationOnce(async () =>
      Object.assign(new Customer(), {
        offers: new Promise(resolve =>
          resolve([
            Object.assign(new Offer(), {
              status: OfferStatus.IN_ACTIVE,
            }),
            Object.assign(new Offer(), {
              status: OfferStatus.IN_ACTIVE,
            }),
            Object.assign(new Offer(), {
              status: OfferStatus.IN_ACTIVE,
            }),
          ]),
        ),
      }),
    );

    const result: ListableDraftOfferDto[] = await handler.execute(
      new ListDraftOffersQuery(faker.random.uuid(), null, 1),
    );
    expect(result).toHaveLength(1);
  });

  it('should return draft offset by 1 and limited to 2', async () => {
    jest.spyOn(customerRepository, 'findOne').mockImplementationOnce(async () =>
      Object.assign(new Customer(), {
        offers: new Promise(resolve =>
          resolve([
            Object.assign(new Offer(), {
              status: OfferStatus.IN_ACTIVE,
              name: 'draft-1',
            }),
            Object.assign(new Offer(), {
              status: OfferStatus.IN_ACTIVE,
              name: 'draft-2',
            }),
            Object.assign(new Offer(), {
              status: OfferStatus.IN_ACTIVE,
              name: 'draft-3',
            }),
          ]),
        ),
      }),
    );

    const result: ListableDraftOfferDto[] = await handler.execute(
      new ListDraftOffersQuery(faker.random.uuid(), 1, 2),
    );

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('draft-2');
    expect(result[1].name).toBe('draft-3');
  });
});
