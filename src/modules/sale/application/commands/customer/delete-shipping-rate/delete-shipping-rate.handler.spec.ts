import { Test, TestingModule } from '@nestjs/testing';
import { DeleteShippingRateHandler } from './delete-shipping-rate.handler';
import { CustomerRepository } from '../../../../domain/customer/customer.repository';
import { ioCContainer } from '../../../../../../config/ioc-container';
import { EntityManager } from 'typeorm';
import { DeleteShippingRateCommand } from './delete-shipping-rate.command';
import { InvalidUuidFormatException } from '../../../../../common/exceptions/invalid-uuid-format.exception';
import * as faker from 'faker';
import { InternalServerErrorException } from '@nestjs/common';
import { Customer } from '../../../../domain/customer/customer';
import { ShippingRate } from '../../../../domain/customer/shipping-rate/shipping-rate';
import { ShippingRateNotFoundException } from '../../../../domain/customer/exceptions/shipping-rate-not-found.exception';

describe('Delete Shipping Rate Handler', () => {
  let handler: DeleteShippingRateHandler;
  let customerRepository: CustomerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteShippingRateHandler,
        ...ioCContainer,
        {
          provide: EntityManager,
          useValue: {
            getRepository: jest.fn().mockReturnThis(),
          },
        },
      ],
    }).compile();

    handler = module.get(DeleteShippingRateHandler);
    customerRepository = module.get(CustomerRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should Delete Shipping Rate Handler be defined', async () => {
    expect(handler).toBeDefined();
  });

  it('should Customer Repository be defined', async () => {
    expect(customerRepository).toBeDefined();
  });

  it('should throw Invalid Uuid Format Exception if shipping rate id is not valid uuid', async () => {
    await expect(
      handler.execute(
        new DeleteShippingRateCommand(faker.random.uuid(), 'invalid-uuid'),
      ),
    ).rejects.toThrowError(InvalidUuidFormatException);
  });

  it('should throw Internal Server Error Exception if selecting customer from Postgres fails', async () => {
    jest.spyOn(customerRepository, 'findOne').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    await expect(
      handler.execute(
        new DeleteShippingRateCommand(faker.random.uuid(), faker.random.uuid()),
      ),
    ).rejects.toThrowError(InternalServerErrorException);
  });

  it('should throw Shipping Rate Not Found Exception if shipping rate with given id does not exist in Postgres', async () => {
    jest
      .spyOn(customerRepository, 'findOne')
      .mockImplementationOnce(async () => {
        return Object.assign(new Customer(), {
          shippingRates: new Promise(resolve =>
            resolve([
              Object.assign(new ShippingRate(), {
                id: faker.random.uuid(),
              }),
            ]),
          ),
        });
      });

    await expect(
      handler.execute(
        new DeleteShippingRateCommand(faker.random.uuid(), faker.random.uuid()),
      ),
    ).rejects.toThrowError(ShippingRateNotFoundException);
  });

  it('should throw Internal Server Error Exception if saving updated customer to Postgres fails', async () => {
    const existingShippingRateId = faker.random.uuid();

    jest
      .spyOn(customerRepository, 'findOne')
      .mockImplementationOnce(async () => {
        return Object.assign(new Customer(), {
          shippingRates: new Promise(resolve =>
            resolve([
              Object.assign(new ShippingRate(), {
                id: existingShippingRateId,
              }),
            ]),
          ),
        });
      });
    jest.spyOn(customerRepository, 'save').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    await expect(
      handler.execute(
        new DeleteShippingRateCommand(
          faker.random.uuid(),
          existingShippingRateId,
        ),
      ),
    ).rejects.toThrowError(InternalServerErrorException);
  });
});
