import { Test, TestingModule } from '@nestjs/testing';
import { UpdateShippingRateHandler } from './update-shipping-rate.handler';
import { CustomerRepository } from '../../../../domain/customer/customer.repository';
import { ioCContainer } from '../../../../../../config/ioc-container';
import { EntityManager } from 'typeorm';
import { UpdateShippingRateCommand } from './update-shipping-rate.command';
import { InvalidUuidFormatException } from '../../../../../common/exceptions/invalid-uuid-format.exception';
import * as faker from 'faker';
import { InternalServerErrorException } from '@nestjs/common';
import { UpdatedShippingRateDto } from '../../../dtos/write/shipping-rate/updated-shipping-rate.dto';
import { Customer } from '../../../../domain/customer/customer';
import { ShippingRateNotFoundException } from '../../../../domain/customer/exceptions/shipping-rate-not-found.exception';
import { ShippingRate } from '../../../../domain/customer/shipping-rate/shipping-rate';

describe('Update Shipping Rate Handler', () => {
  let handler: UpdateShippingRateHandler;
  let customerRepository: CustomerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateShippingRateHandler,
        ...ioCContainer,
        {
          provide: EntityManager,
          useValue: {
            getRepository: jest.fn().mockReturnThis(),
          },
        },
      ],
    }).compile();

    handler = module.get(UpdateShippingRateHandler);
    customerRepository = module.get(CustomerRepository);
  });

  it('should Update Shipping Rate Handler be defined', async () => {
    expect(handler).toBeDefined();
  });

  it('should Customer Repository be defined', async () => {
    expect(customerRepository).toBeDefined();
  });

  it('should throw Invalid Uuid Format Exception if shipping rate id is not valid uuid', async () => {
    await expect(
      handler.execute(
        new UpdateShippingRateCommand(faker.random.uuid(), {
          id: 'invalid-uuid',
        }),
      ),
    ).rejects.toThrowError(InvalidUuidFormatException);
  });

  it('should throw Internal Server Error Exception if selecting customer from Postgres fails', async () => {
    jest.spyOn(customerRepository, 'findOne').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    const updatedShippingRate: UpdatedShippingRateDto = {
      id: faker.random.uuid(),
      name: 'updated shipping rate name',
    };

    await expect(
      handler.execute(
        new UpdateShippingRateCommand(faker.random.uuid(), updatedShippingRate),
      ),
    ).rejects.toThrowError(InternalServerErrorException);
  });

  it('should throw Shipping Rate Not Found Exception if shipping rate with given id not exists in Postgres', async () => {
    jest.spyOn(customerRepository, 'findOne').mockImplementationOnce(async () =>
      Object.assign(new Customer(), {
        shippingRates: new Promise(resolve => resolve([])),
      }),
    );

    const updatedShippingRate: UpdatedShippingRateDto = {
      id: faker.random.uuid(),
      name: 'updated shipping rate name',
    };

    await expect(
      handler.execute(
        new UpdateShippingRateCommand(faker.random.uuid(), updatedShippingRate),
      ),
    ).rejects.toThrowError(ShippingRateNotFoundException);
  });

  it('should throw Internal Server Error if saving updated customer to Postgres fails', async () => {
    const existingShippingRateId = faker.random.uuid();

    jest.spyOn(customerRepository, 'findOne').mockImplementationOnce(async () =>
      Object.assign(new Customer(), {
        shippingRates: new Promise(resolve =>
          resolve([
            Object.assign(new ShippingRate(), {
              id: existingShippingRateId,
            }),
          ]),
        ),
      }),
    );
    jest.spyOn(customerRepository, 'save').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    const updatedShippingRate: UpdatedShippingRateDto = {
      id: existingShippingRateId,
      name: 'updated shipping rate name',
    };

    await expect(
      handler.execute(
        new UpdateShippingRateCommand(faker.random.uuid(), updatedShippingRate),
      ),
    ).rejects.toThrowError(InternalServerErrorException);
  });
});
