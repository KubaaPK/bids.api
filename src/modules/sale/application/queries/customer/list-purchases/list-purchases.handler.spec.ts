import { Test, TestingModule } from '@nestjs/testing';
import { ListPurchasesHandler } from './list-purchases.handler';
import { CustomerRepository } from '../../../../domain/customer/customer.repository';
import { ioCContainer } from '../../../../../../config/ioc-container';
import { EntityManager } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import * as faker from 'faker';
import { ListPurchasesQuery } from './list-purchases.query';
import { Purchase } from '../../../../domain/purchase/purchase';
import { Customer } from '../../../../domain/customer/customer';
import { ListablePurchaseDto } from '../../../dtos/read/purchase/listable-purchase.dto';
import { Offer } from '../../../../domain/offer/offer';

describe('List Purchase Handler', () => {
  let handler: ListPurchasesHandler;
  let customerRepository: CustomerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListPurchasesHandler,
        ...ioCContainer,
        {
          provide: EntityManager,
          useValue: {
            getRepository: jest.fn().mockReturnThis(),
          },
        },
      ],
    }).compile();

    handler = module.get(ListPurchasesHandler);
    customerRepository = module.get(CustomerRepository);
  });

  it('should List Purchases Handler be defined', async () => {
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
      handler.execute(new ListPurchasesQuery(faker.random.uuid())),
    ).rejects.toThrowError(InternalServerErrorException);
  });

  it('should return array with customer purchases', async () => {
    const purchase: Purchase = Object.assign(new Purchase(), {
      buyer: new Promise(resolve =>
        resolve(
          Object.assign(new Customer(), {
            id: faker.random.uuid(),
          }),
        ),
      ),
      offer: new Promise(resolve =>
        resolve(
          Object.assign(new Offer(), {
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
    });

    jest.spyOn(customerRepository, 'findOne').mockImplementationOnce(async () =>
      Object.assign(new Customer(), {
        purchases: new Promise(resolve =>
          resolve([purchase, purchase, purchase]),
        ),
      }),
    );

    const purchases: any[] = await handler.execute(
      new ListPurchasesQuery(faker.random.uuid()),
    );

    expect(Array.isArray(purchases)).toBeTruthy();
  });

  it('should single array element be an instance of Listable Purchase Dto', async () => {
    const purchase: Purchase = Object.assign(new Purchase(), {
      buyer: new Promise(resolve =>
        resolve(
          Object.assign(new Customer(), {
            id: faker.random.uuid(),
          }),
        ),
      ),
      offer: new Promise(resolve =>
        resolve(
          Object.assign(new Offer(), {
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
    });

    jest.spyOn(customerRepository, 'findOne').mockImplementationOnce(async () =>
      Object.assign(new Customer(), {
        purchases: new Promise(resolve =>
          resolve([purchase, purchase, purchase]),
        ),
      }),
    );

    const purchases: any[] = await handler.execute(
      new ListPurchasesQuery(faker.random.uuid()),
    );

    expect(purchases[0]).toBeInstanceOf(ListablePurchaseDto);
  });
});
