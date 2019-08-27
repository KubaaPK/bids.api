import { Test, TestingModule } from '@nestjs/testing';
import { UpdateDeliveryMethodHandler } from './update-delivery-method.handler';
import { DeliveryMethodRepository } from '../../../../domain/delivery/delivery-method.repository';
import { ioCContainer } from '../../../../../../config/ioc-container';
import { EntityManager } from 'typeorm';
import { UpdateDeliveryMethodCommand } from './update-delivery-method.command';
import { InvalidUuidFormatException } from '../../../../../common/exceptions/invalid-uuid-format.exception';
import { UpdatedDeliveryMethodDto } from '../../../dtos/write/updated-delivery-method.dto';
import { DeliveryMethodNotFoundException } from '../../../../domain/delivery/exceptions/delivery-method-not-found.exception';
import { InternalServerErrorException } from '@nestjs/common';
import { DeliveryMethod } from '../../../../domain/delivery/delivery-method';

describe('Update Delivery Method Handler', () => {
  let handler: UpdateDeliveryMethodHandler;
  let deliveryMethodRepository: DeliveryMethodRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateDeliveryMethodHandler,
        ...ioCContainer,
        {
          provide: EntityManager,
          useValue: {
            getRepository: jest.fn().mockReturnThis(),
          },
        },
      ],
    }).compile();

    handler = module.get(UpdateDeliveryMethodHandler);
    deliveryMethodRepository = module.get(DeliveryMethodRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should Update Delivery Method Handler be defined', async () => {
    expect(handler).toBeDefined();
  });

  it('should Delivery Method Repository be defined', async () => {
    expect(deliveryMethodRepository).toBeDefined();
  });

  it('should throw Invalid Uuid Format Exception if delivery method id is not valid uuid', async () => {
    const updatedDeliveryMethod: UpdatedDeliveryMethodDto = {
      name: 'updated-delivery-method-name',
    };

    await expect(
      handler.execute(
        new UpdateDeliveryMethodCommand('invalid-uuid', updatedDeliveryMethod),
      ),
    ).rejects.toThrowError(InvalidUuidFormatException);
  });

  it('should throw Internal Server Error Exception if selecting delivery method from Postgres fails', async () => {
    jest
      .spyOn(deliveryMethodRepository, 'findOne')
      .mockImplementationOnce(() => {
        throw new InternalServerErrorException();
      });

    const updatedDeliveryMethod: UpdatedDeliveryMethodDto = {
      name: 'updated-delivery-method-name',
    };

    await expect(
      handler.execute(
        new UpdateDeliveryMethodCommand(
          'b1c6a6bf-39ee-46dc-8a66-5d4b6cb76c24',
          updatedDeliveryMethod,
        ),
      ),
    ).rejects.toThrowError(InternalServerErrorException);
  });

  it('should throw Delivery Method Not Found Exception if delivery method with given id does not exist in Postgres', async () => {
    jest
      .spyOn(deliveryMethodRepository, 'findOne')
      .mockImplementationOnce(() => undefined);

    const updatedDeliveryMethod: UpdatedDeliveryMethodDto = {
      name: 'updated-delivery-method-name',
    };

    await expect(
      handler.execute(
        new UpdateDeliveryMethodCommand(
          'b1c6a6bf-39ee-46dc-8a66-5d4b6cb76c24',
          updatedDeliveryMethod,
        ),
      ),
    ).rejects.toThrowError(DeliveryMethodNotFoundException);
  });

  it('should throw Internal Server Error Exception if saving updated delivery method to Postgres fails', async () => {
    jest
      .spyOn(deliveryMethodRepository, 'findOne')
      .mockImplementationOnce(async () => new DeliveryMethod());
    jest.spyOn(deliveryMethodRepository, 'save').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    const updatedDeliveryMethod: UpdatedDeliveryMethodDto = {
      name: 'updated-delivery-method-name',
    };

    await expect(
      handler.execute(
        new UpdateDeliveryMethodCommand(
          'b1c6a6bf-39ee-46dc-8a66-5d4b6cb76c24',
          updatedDeliveryMethod,
        ),
      ),
    ).rejects.toThrowError(InternalServerErrorException);
  });
});
