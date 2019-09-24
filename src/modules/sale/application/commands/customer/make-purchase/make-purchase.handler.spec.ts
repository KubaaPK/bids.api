import { MakePurchaseHandler } from './make-purchase.handler';
import { Test, TestingModule } from '@nestjs/testing';
import { ioCContainer } from '../../../../../../config/ioc-container';
import { EntityManager } from 'typeorm';
import { OfferRepository } from '../../../../domain/offer/offer.repository';
import {
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { NewPurchaseDto } from '../../../dtos/write/purchase/new-purchase.dto';
import * as faker from 'faker';
import { MakePurchaseCommand } from './make-purchase.command';
import { Offer } from '../../../../domain/offer/offer';
import { Customer } from '../../../../domain/customer/customer';
import { EventBus } from '@nestjs/cqrs';
import { Purchase } from '../../../../domain/purchase/purchase';
import { PurchaseMadeEvent } from '../../../events/purchase-made/purchase-made.event';
import { PurchaseRepository } from '../../../../domain/purchase/purchase.repository';
import { NoItemsInStockException } from '../../../../domain/offer/exceptions/no-items-in-stock.exception';

describe('Make Purchase Handler', () => {
  let handler: MakePurchaseHandler;
  let offerRepository: OfferRepository;
  let purchaseRepository: PurchaseRepository;
  let eventBus: EventBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MakePurchaseHandler,
        ...ioCContainer,
        {
          provide: EntityManager,
          useValue: {
            getRepository: jest.fn().mockReturnThis(),
          },
        },
        {
          provide: EventBus,
          useValue: {
            publish: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get(MakePurchaseHandler);
    offerRepository = module.get(OfferRepository);
    purchaseRepository = module.get(PurchaseRepository);
    eventBus = module.get(EventBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should Make Purchase Handler be defined', async () => {
    expect(handler).toBeDefined();
  });

  it('should Offer Repository be defined', async () => {
    expect(offerRepository).toBeDefined();
  });

  it('should Purchase Repository be defined', async () => {
    expect(purchaseRepository).toBeDefined();
  });

  it('should Event Bus be defined', async () => {
    expect(eventBus).toBeDefined();
  });

  it('should throw Internal Server Error Exception if selecting offer from Postgres fails', async () => {
    jest.spyOn(offerRepository, 'findOne').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    const newPurchase: NewPurchaseDto = {
      amount: 1,
      buyerId: faker.random.uuid(),
      id: faker.random.uuid(),
      offerId: faker.random.uuid(),
    };

    await expect(
      handler.execute(new MakePurchaseCommand(newPurchase)),
    ).rejects.toThrowError(InternalServerErrorException);
  });

  it('should throw Unprocessable Entity Exception if customer is trying to buy own products', async () => {
    const customerId = faker.random.uuid();

    jest.spyOn(offerRepository, 'findOne').mockImplementationOnce(async () => {
      return Object.assign(new Offer(), {
        customer: new Promise(resolve =>
          resolve(
            Object.assign(new Customer(), {
              id: customerId,
            }),
          ),
        ),
        stock: {
          available: 10,
        },
      });
    });

    const newPurchase: NewPurchaseDto = {
      amount: 3,
      buyerId: customerId,
      id: faker.random.uuid(),
      offerId: faker.random.uuid(),
    };

    await expect(
      handler.execute(new MakePurchaseCommand(newPurchase)),
    ).rejects.toThrowError(UnprocessableEntityException);
  });

  it('should throw No Items In Stock Exception if there is no enough offer items in stock', async () => {
    jest.spyOn(offerRepository, 'findOne').mockImplementationOnce(async () =>
      Object.assign(new Offer(), {
        stock: {
          available: 2,
        },
        customer: new Promise(resolve =>
          resolve(
            Object.assign(new Customer(), {
              id: faker.random.uuid(),
            }),
          ),
        ),
      }),
    );

    const newPurchase: NewPurchaseDto = {
      amount: 3,
      buyerId: faker.random.uuid(),
      id: faker.random.uuid(),
      offerId: faker.random.uuid(),
    };

    await expect(
      handler.execute(new MakePurchaseCommand(newPurchase)),
    ).rejects.toThrowError(NoItemsInStockException);
  });

  it('should throw Not Found Exception if offer with given id does not exist in Postgres', async () => {
    jest
      .spyOn(offerRepository, 'findOne')
      .mockImplementationOnce(() => undefined);

    const newPurchase: NewPurchaseDto = {
      amount: 3,
      buyerId: faker.random.uuid(),
      id: faker.random.uuid(),
      offerId: faker.random.uuid(),
    };

    await expect(
      handler.execute(new MakePurchaseCommand(newPurchase)),
    ).rejects.toThrowError(NotFoundException);
  });

  it('should throw Internal Server Error Exception if saving purchase to Postgres fails', async () => {
    jest.spyOn(offerRepository, 'findOne').mockImplementationOnce(async () =>
      Object.assign(new Offer(), {
        stock: {
          available: 6,
        },
        customer: new Promise(resolve =>
          resolve(
            Object.assign(new Customer(), {
              id: faker.random.uuid(),
            }),
          ),
        ),
      }),
    );
    jest.spyOn(purchaseRepository, 'save').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    const newPurchase: NewPurchaseDto = {
      amount: 3,
      buyerId: faker.random.uuid(),
      id: faker.random.uuid(),
      offerId: faker.random.uuid(),
    };

    await expect(
      handler.execute(new MakePurchaseCommand(newPurchase)),
    ).rejects.toThrowError(InternalServerErrorException);
  });

  it('should emit Purchase Made Event if item has been successfully bought', async () => {
    const createdPurchaseId = faker.random.uuid();
    const customerId = faker.random.uuid();
    const offer: Offer = Object.assign(new Offer(), {
      stock: {
        available: 6,
      },
      customer: new Promise(resolve =>
        resolve(
          Object.assign(new Customer(), {
            id: faker.random.uuid(),
          }),
        ),
      ),
    });
    const eventBusSpy: jest.SpyInstance = jest.spyOn(eventBus, 'publish');

    jest
      .spyOn(offerRepository, 'findOne')
      .mockImplementationOnce(async () => offer);
    jest.spyOn(purchaseRepository, 'save').mockImplementationOnce(async () => {
      return Object.assign(new Purchase(), {
        id: createdPurchaseId,
        customer: Object.assign(new Customer(), { id: customerId }),
      });
    });

    const newPurchase: NewPurchaseDto = {
      amount: 3,
      buyerId: customerId,
      id: faker.random.uuid(),
      offerId: faker.random.uuid(),
    };

    await handler.execute(new MakePurchaseCommand(newPurchase));

    expect(eventBusSpy).toBeCalledWith(
      new PurchaseMadeEvent(
        customerId,
        createdPurchaseId,
        newPurchase.amount,
        offer,
      ),
    );
  });
});
