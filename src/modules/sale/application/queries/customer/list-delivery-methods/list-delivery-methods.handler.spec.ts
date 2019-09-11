import { Test, TestingModule } from '@nestjs/testing';
import { ListDeliveryMethodsHandler } from './list-delivery-methods.handler';
import { DeliveryMethodRepository } from '../../../../domain/delivery/delivery-method.repository';
import { ioCContainer } from '../../../../../../config/ioc-container';
import { EntityManager } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { ListDeliveryMethodsQuery } from './list-delivery-methods.query';
import { DeliveryMethod } from '../../../../domain/delivery/delivery-method';
import { ListableDeliveryMethodDto } from '../../../dtos/read/listable-delivery-method.dto';

describe('List Delivery Methods Handler', () => {
  let handler: ListDeliveryMethodsHandler;
  let deliveryMethodRepository: DeliveryMethodRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListDeliveryMethodsHandler,
        ...ioCContainer,
        {
          provide: EntityManager,
          useValue: {
            getRepository: jest.fn().mockReturnThis(),
          },
        },
      ],
    }).compile();

    handler = module.get(ListDeliveryMethodsHandler);
    deliveryMethodRepository = module.get(DeliveryMethodRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should List Delivery Methods Handler be defined', async () => {
    expect(handler).toBeDefined();
  });

  it('should Delivery Method Repository be defined', async () => {
    expect(deliveryMethodRepository).toBeDefined();
  });

  it('should throw Internal Server Error Exception if selecting delivery methods from Postgres fails', async () => {
    jest.spyOn(deliveryMethodRepository, 'find').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    await expect(
      handler.execute(new ListDeliveryMethodsQuery()),
    ).rejects.toThrowError(InternalServerErrorException);
  });

  it('should return an array with delivery methods', async () => {
    jest
      .spyOn(deliveryMethodRepository, 'find')
      .mockImplementationOnce(async () => {
        return [new DeliveryMethod(), new DeliveryMethod()];
      });

    const deliveryMethods: any = await handler.execute(
      new ListDeliveryMethodsQuery(),
    );

    expect(Array.isArray(deliveryMethods)).toBeTruthy();
  });

  it('should single array element be an instance of Listable Delivery Method Dto', async () => {
    jest
      .spyOn(deliveryMethodRepository, 'find')
      .mockImplementationOnce(async () => {
        return [new DeliveryMethod(), new DeliveryMethod()];
      });

    const deliveryMethods: ListableDeliveryMethodDto[] = await handler.execute(
      new ListDeliveryMethodsQuery(),
    );

    expect(deliveryMethods[0]).toBeInstanceOf(ListableDeliveryMethodDto);
  });
});
