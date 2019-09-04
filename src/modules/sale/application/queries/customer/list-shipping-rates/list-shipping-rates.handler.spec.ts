import { Test, TestingModule } from '@nestjs/testing';
import { ListShippingRatesHandler } from './list-shipping-rates.handler';
import { CustomerRepository } from '../../../../domain/customer/customer.repository';
import { ioCContainer } from '../../../../../../config/ioc-container';
import { EntityManager } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import * as faker from 'faker';
import { ListShippingRatesQuery } from './list-shipping-rates.query';
import { Customer } from '../../../../domain/customer/customer';
import { ShippingRate } from '../../../../domain/customer/shipping-rate/shipping-rate';
import { ListableShippingRateDto } from '../../../dtos/read/listable-shipping-rate.dto';

describe('List Shipping Rates Handler', () => {
  let handler: ListShippingRatesHandler;
  let customerRepository: CustomerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListShippingRatesHandler,
        ...ioCContainer,
        {
          provide: EntityManager,
          useValue: {
            getRepository: jest.fn().mockReturnThis(),
          },
        },
      ],
    }).compile();

    handler = module.get(ListShippingRatesHandler);
    customerRepository = module.get(CustomerRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should List Shipping Rates Handler be defined', async () => {
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
      handler.execute(new ListShippingRatesQuery(faker.random.uuid())),
    ).rejects.toThrowError(InternalServerErrorException);
  });

  it('should return an array with shipping rates', async () => {
    jest.spyOn(customerRepository, 'findOne').mockImplementationOnce(async () =>
      Object.assign(new Customer(), {
        shippingRates: new Promise(resolve =>
          resolve([new ShippingRate(), new ShippingRate()]),
        ),
      }),
    );

    const result: any[] = await handler.execute(
      new ListShippingRatesQuery(faker.random.uuid()),
    );

    expect(Array.isArray(result)).toBeTruthy();
  });

  it('should single array element be an instance of Listable Shipping Rate Dto', async () => {
    jest.spyOn(customerRepository, 'findOne').mockImplementationOnce(async () =>
      Object.assign(new Customer(), {
        shippingRates: new Promise(resolve =>
          resolve([new ShippingRate(), new ShippingRate()]),
        ),
      }),
    );

    const result: ListableShippingRateDto[] = await handler.execute(
      new ListShippingRatesQuery(faker.random.uuid()),
    );

    expect(result[0]).toBeInstanceOf(ListableShippingRateDto);
  });
});
