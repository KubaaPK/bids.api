import { ListSalesHandler } from './list-sales.handler';
import { CustomerRepository } from '../../../../domain/customer/customer.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { ioCContainer } from '../../../../../../config/ioc-container';
import { EntityManager } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { ListSalesQuery } from './list-sales.query';
import * as faker from 'faker';
import { Customer } from '../../../../domain/customer/customer';
import { Sale } from '../../../../domain/sale/sale';
import { ListableSaleDto } from '../../../dtos/read/sale/listable-sale.dto';
import { Purchase } from '../../../../domain/purchase/purchase';

describe('List Sales Handler', () => {
  let handler: ListSalesHandler;
  let customerRepository: CustomerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListSalesHandler,
        ...ioCContainer,
        {
          provide: EntityManager,
          useValue: {
            getRepository: jest.fn().mockReturnThis(),
          },
        },
      ],
    }).compile();

    handler = module.get(ListSalesHandler);
    customerRepository = module.get(CustomerRepository);
  });

  it('should List Sales Handler be defined', async () => {
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
      handler.execute(new ListSalesQuery(faker.random.uuid())),
    ).rejects.toThrowError(InternalServerErrorException);
  });

  it('should return array with customer sales', async () => {
    const sale: Sale = Object.assign(new Sale(), {
      purchase: new Promise(resolve =>
        resolve(
          Object.assign(new Purchase(), {
            buyer: new Customer(),
          }),
        ),
      ),
    });

    jest.spyOn(customerRepository, 'findOne').mockImplementationOnce(async () =>
      Object.assign(new Customer(), {
        sales: new Promise(resolve => resolve([sale, sale, sale])),
      }),
    );

    const sales: any[] = await handler.execute(
      new ListSalesQuery(faker.random.uuid()),
    );
    expect(Array.isArray(sales)).toBeTruthy();
  });

  it('should single array element be an instance of Listable Sale Dto', async () => {
    const sale: Sale = Object.assign(new Sale(), {
      purchase: new Promise(resolve =>
        resolve(
          Object.assign(new Purchase(), {
            buyer: new Customer(),
          }),
        ),
      ),
    });

    jest.spyOn(customerRepository, 'findOne').mockImplementationOnce(async () =>
      Object.assign(new Customer(), {
        sales: new Promise(resolve => resolve([sale, sale, sale])),
      }),
    );

    const sales: ListableSaleDto[] = await handler.execute(
      new ListSalesQuery(faker.random.uuid()),
    );
    expect(sales[0]).toBeInstanceOf(ListableSaleDto);
  });
});
