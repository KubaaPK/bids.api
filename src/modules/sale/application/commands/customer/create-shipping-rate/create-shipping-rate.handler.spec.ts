import { Test, TestingModule } from '@nestjs/testing';
import { CreateShippingRateHandler } from './create-shipping-rate.handler';
import { CustomerRepository } from '../../../../domain/customer/customer.repository';
import { ioCContainer } from '../../../../../../config/ioc-container';
import { EntityManager } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { CreateShippingRateCommand } from './create-shipping-rate.command';
import { NewShippingRateDto } from '../../../dtos/write/shipping-rate/new-shipping-rate.dto';
import { Customer } from '../../../../domain/customer/customer';
import { ShippingRate } from '../../../../domain/customer/shipping-rate/shipping-rate';
import { ShippingRateAlreadyExistsException } from '../../../../domain/customer/exceptions/shipping-rate-already-exists.exception';
import { ToManyShippingRatesDefinedException } from '../../../../domain/customer/exceptions/to-many-shipping-rates-defined.exception';
import { DeliveryMethodRepository } from '../../../../domain/delivery/delivery-method.repository';
import { ShippingRateItemDto } from '../../../dtos/write/shipping-rate/shipping-rate-item.dto';
import { DeliveryMethodNotFoundException } from '../../../../domain/delivery/exceptions/delivery-method-not-found.exception';

describe('Create Shipping Rate Handler', () => {
  let handler: CreateShippingRateHandler;
  let customerRepository: CustomerRepository;
  let deliveryMethodRepository: DeliveryMethodRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateShippingRateHandler,
        ...ioCContainer,
        {
          provide: EntityManager,
          useValue: {
            getRepository: jest.fn().mockReturnThis(),
          },
        },
      ],
    }).compile();

    handler = module.get(CreateShippingRateHandler);
    customerRepository = module.get(CustomerRepository);
    deliveryMethodRepository = module.get(DeliveryMethodRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should Create Shipping Rate Handler be defined', async () => {
    expect(handler).toBeDefined();
  });

  it('should Customer Repository be defined', async () => {
    expect(customerRepository).toBeDefined();
  });

  it('should Delivery Method Repository be defined', async () => {
    expect(deliveryMethodRepository).toBeDefined();
  });

  it('should throw Delivery Method Not Found Exception if one of delivery method passed with rates does not exists in Postgres', async () => {
    jest
      .spyOn(deliveryMethodRepository, 'findOne')
      .mockImplementationOnce(() => undefined);

    const newShippingRate: NewShippingRateDto = {
      id: '810ce780-d2cb-460d-baaf-67efe8fa42f7',
      name: 'Cennik dla elektroniki.',
      rates: [
        ({
          deliveryMethod: {
            id: '8db4c23c-fce6-4e88-b46e-5164bb582e0e',
          },
        } as unknown) as ShippingRateItemDto,
      ],
    };

    await expect(
      handler.execute(
        new CreateShippingRateCommand(
          '22f98479-fcc0-44ba-b7d7-8c61787701a2',
          newShippingRate,
        ),
      ),
    ).rejects.toThrowError(DeliveryMethodNotFoundException);
  });

  it('should throw Internal Server Error Exception if selecting customer from Postgres fails', async () => {
    jest.spyOn(customerRepository, 'findOne').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    const newShippingRate: NewShippingRateDto = {
      id: '810ce780-d2cb-460d-baaf-67efe8fa42f7',
      name: 'Cennik dla elektroniki.',
    };

    await expect(
      handler.execute(
        new CreateShippingRateCommand(
          '22f98479-fcc0-44ba-b7d7-8c61787701a2',
          newShippingRate,
        ),
      ),
    ).rejects.toThrowError(InternalServerErrorException);
  });

  it('should throw Shipping Rate Already Exists if shipping rate with given name already exists in Postgres', async () => {
    jest.spyOn(customerRepository, 'findOne').mockImplementationOnce(async () =>
      Object.assign(new Customer(), {
        shippingRates: new Promise(resolve =>
          resolve([
            Object.assign(new ShippingRate(), {
              name: 'Cennik dla elektroniki.',
            }),
          ]),
        ),
      }),
    );

    const newShippingRate: NewShippingRateDto = {
      id: '810ce780-d2cb-460d-baaf-67efe8fa42f7',
      name: 'Cennik dla elektroniki.',
    };

    await expect(
      handler.execute(
        new CreateShippingRateCommand(
          '22f98479-fcc0-44ba-b7d7-8c61787701a2',
          newShippingRate,
        ),
      ),
    ).rejects.toThrowError(ShippingRateAlreadyExistsException);
  });

  it('should throw To Many Shipping Rates Defined exception if customer defined 100 shipping rates already', async () => {
    jest.spyOn(customerRepository, 'findOne').mockImplementationOnce(async () =>
      Object.assign(new Customer(), {
        shippingRates: new Promise((resolve: any) => {
          const shippingRateArrayStub = [];
          shippingRateArrayStub.length = 100;
          resolve(shippingRateArrayStub);
        }),
      }),
    );

    const newShippingRate: NewShippingRateDto = {
      id: '810ce780-d2cb-460d-baaf-67efe8fa42f7',
      name: 'Cennik dla elektroniki.',
    };

    await expect(
      handler.execute(
        new CreateShippingRateCommand(
          '22f98479-fcc0-44ba-b7d7-8c61787701a2',
          newShippingRate,
        ),
      ),
    ).rejects.toThrowError(ToManyShippingRatesDefinedException);
  });

  it('should throw Internal Server Error Exception if saving customer to Postgres fails', async () => {
    jest.spyOn(customerRepository, 'findOne').mockImplementationOnce(async () =>
      Object.assign(new Customer(), {
        shippingRates: new Promise(resolve => resolve([])),
      }),
    );
    jest.spyOn(customerRepository, 'save').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    const newShippingRate: NewShippingRateDto = {
      id: '810ce780-d2cb-460d-baaf-67efe8fa42f7',
      name: 'Cennik dla elektroniki.',
    };

    await expect(
      handler.execute(
        new CreateShippingRateCommand(
          '22f98479-fcc0-44ba-b7d7-8c61787701a2',
          newShippingRate,
        ),
      ),
    ).rejects.toThrowError(InternalServerErrorException);
  });
});
