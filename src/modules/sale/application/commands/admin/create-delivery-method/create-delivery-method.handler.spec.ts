import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryMethodRepository } from '../../../../domain/delivery/delivery-method.repository';
import { ioCContainer } from '../../../../../../config/ioc-container';
import { EntityManager } from 'typeorm';
import { CreateDeliveryMethodHandler } from './create-delivery-method.handler';
import { InternalServerErrorException } from '@nestjs/common';
import { NewDeliveryMethodDto } from '../../../dtos/write/new-delivery-method.dto';
import { PaymentPolicy } from '../../../../domain/delivery/payment-policy.enum';
import { CreateDeliveryMethodCommand } from './create-delivery-method.command';
import { DeliveryMethod } from '../../../../domain/delivery/delivery-method';
import { DeliveryMethodAlreadyExistsException } from '../../../../domain/delivery/exceptions/delivery-method-already-exists.exception';

describe('Create Shipping Rate Handler', () => {
  let handler: CreateDeliveryMethodHandler;
  let deliveryMethodRepository: DeliveryMethodRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateDeliveryMethodHandler,
        ...ioCContainer,
        {
          provide: EntityManager,
          useValue: {
            getRepository: jest.fn().mockReturnThis(),
          },
        },
      ],
    }).compile();

    handler = module.get(CreateDeliveryMethodHandler);
    deliveryMethodRepository = module.get(DeliveryMethodRepository);
  });

  it('should Create Delivery Method Handler be defined', async () => {
    expect(handler).toBeDefined();
  });

  it('should Delivery Method Repository be defined', async () => {
    expect(deliveryMethodRepository).toBeDefined();
  });

  it('should throw Internal Server Error Exception if selecting delivery method from Postgres fails', async () => {
    jest
      .spyOn(deliveryMethodRepository, 'findOne')
      .mockImplementationOnce(() => {
        throw new InternalServerErrorException();
      });

    const newDeliveryMethod: NewDeliveryMethodDto = {
      id: undefined,
      name: 'Przesyłka kurierska',
      paymentPolicy: PaymentPolicy.CASH_ON_DELIVERY,
    };

    await expect(
      handler.execute(new CreateDeliveryMethodCommand(newDeliveryMethod)),
    ).rejects.toThrowError(InternalServerErrorException);
  });

  it('should throw Delivery Method Already Exists if delivery method with given name and payment policy already exists in Postgres', async () => {
    jest
      .spyOn(deliveryMethodRepository, 'findOne')
      .mockImplementationOnce(async () =>
        Object.assign(new DeliveryMethod(), {
          name: 'Przesyłka kurierska',
          paymentPolicy: PaymentPolicy.CASH_ON_DELIVERY,
        }),
      );

    const newDeliveryMethod: NewDeliveryMethodDto = {
      id: undefined,
      name: 'Przesyłka kurierska',
      paymentPolicy: PaymentPolicy.CASH_ON_DELIVERY,
    };

    await expect(
      handler.execute(new CreateDeliveryMethodCommand(newDeliveryMethod)),
    ).rejects.toThrowError(DeliveryMethodAlreadyExistsException);
  });

  it('should throw Internal Server Error Exception if saving delivery method to Postgres fails', async () => {
    jest
      .spyOn(deliveryMethodRepository, 'findOne')
      .mockImplementationOnce(async () =>
        Object.assign(new DeliveryMethod(), {
          name: 'Przesyłka kurierska',
          paymentPolicy: PaymentPolicy.CASH_ON_DELIVERY,
        }),
      );
    jest.spyOn(deliveryMethodRepository, 'save').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    const newDeliveryMethod: NewDeliveryMethodDto = {
      id: undefined,
      name: 'Przesyłka kurierska',
      paymentPolicy: PaymentPolicy.IN_ADVANCE,
    };

    await expect(
      handler.execute(new CreateDeliveryMethodCommand(newDeliveryMethod)),
    ).rejects.toThrowError(InternalServerErrorException);
  });
});
