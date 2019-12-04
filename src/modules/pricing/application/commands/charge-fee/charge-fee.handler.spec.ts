import { ChargeFeeHandler } from './charge-fee.handler';
import { FeeRepository } from '../../../domain/fee/fee.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { ioCContainer } from '../../../../../config/ioc-container';
import { EntityManager } from 'typeorm';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { FeeCalculator } from '../../../domain/fee/fee-calculator';
import { PurchaseRepository } from '../../../../sale/domain/purchase/purchase.repository';
import { ChargeFeeCommand } from './charge-fee.command';
import * as faker from 'faker';
import { Purchase } from '../../../../sale/domain/purchase/purchase';
import { Offer } from '../../../../sale/domain/offer/offer';
import { Category } from '../../../../sale/domain/category/category';
import SpyInstance = jest.SpyInstance;
import { Customer } from '../../../../sale/domain/customer/customer';

describe('Charge Fee Handler', () => {
  let handler: ChargeFeeHandler;
  let feeRepository: FeeRepository;
  let purchaseRepository: PurchaseRepository;
  let feeCalculator: FeeCalculator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChargeFeeHandler,
        ...ioCContainer,
        {
          provide: EntityManager,
          useValue: {
            getRepository: jest.fn().mockReturnThis(),
          },
        },
      ],
    }).compile();

    handler = module.get(ChargeFeeHandler);
    feeRepository = module.get(FeeRepository);
    feeCalculator = module.get(FeeCalculator);
    purchaseRepository = module.get(PurchaseRepository);
  });

  it('should Charge Fee Handler be defined', async () => {
    expect(handler).toBeDefined();
  });

  it('should Fee Repository be defined', async () => {
    expect(feeRepository).toBeDefined();
  });

  it('should Fee Calculator be defined', async () => {
    expect(feeCalculator).toBeDefined();
  });

  it('should Purchase Repository be defined', async () => {
    expect(purchaseRepository).toBeDefined();
  });

  it('should throw Internal Server Error Exception if selecting purchase from Postgres fails', async () => {
    jest.spyOn(purchaseRepository, 'findOne').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    await expect(
      handler.execute(new ChargeFeeCommand(faker.random.uuid())),
    ).rejects.toThrowError(InternalServerErrorException);
  });

  it('should throw Not Found Exception if purchase with given id does not exist', async () => {
    jest
      .spyOn(purchaseRepository, 'findOne')
      .mockImplementationOnce(() => undefined);

    await expect(
      handler.execute(new ChargeFeeCommand(faker.random.uuid())),
    ).rejects.toThrowError(NotFoundException);
  });

  it('should throw Internal Server Error Exception if saving fee to Postgres fails', async () => {
    jest.spyOn(purchaseRepository, 'findOne').mockImplementationOnce(async () =>
      Object.assign(new Purchase(), {
        amount: 3,
        offer: new Promise(resolve =>
          resolve(
            Object.assign(new Offer(), {
              sellingMode: {
                format: 'BUY_NOW',
                price: {
                  amount: '1000.00',
                  currency: 'PLN',
                },
              },
              category: new Promise(resolve =>
                resolve(
                  Object.assign(new Category(), {
                    name: 'Telewizory',
                  }),
                ),
              ),
              customer: new Promise(resolve =>
                resolve(
                  Object.assign(new Customer(), {
                    id: faker.random.uuid(),
                  }),
                ),
              ),
            }),
          ),
        ),
      }),
    );

    jest.spyOn(feeRepository, 'save').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    await expect(
      handler.execute(new ChargeFeeCommand(faker.random.uuid())),
    ).rejects.toThrowError(InternalServerErrorException);
  });

  it('should save properly fee to Postgres', async () => {
    const debtorId = faker.random.uuid();

    jest.spyOn(purchaseRepository, 'findOne').mockImplementationOnce(async () =>
      Object.assign(new Purchase(), {
        amount: 3,
        offer: new Promise(resolve =>
          resolve(
            Object.assign(new Offer(), {
              sellingMode: {
                format: 'BUY_NOW',
                price: {
                  amount: '1000.00',
                  currency: 'PLN',
                },
              },
              category: new Promise(resolve =>
                resolve(
                  Object.assign(new Category(), {
                    name: 'Telewizory',
                  }),
                ),
              ),
              customer: new Promise(resolve =>
                resolve(
                  Object.assign(new Customer(), {
                    id: debtorId,
                  }),
                ),
              ),
            }),
          ),
        ),
      }),
    );

    const feeSaveSpy: SpyInstance = jest
      .spyOn(feeRepository, 'save')
      .mockImplementationOnce(() => undefined);
    const purchaseId = faker.random.uuid();

    await handler.execute(new ChargeFeeCommand(purchaseId));

    expect(feeSaveSpy).toBeCalledWith({
      debtor: new Customer(debtorId),
      purchase: new Purchase(purchaseId),
      fee: {
        amount: '60.00',
        currency: 'PLN',
      },
    });
  });
});
