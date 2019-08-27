import { Test, TestingModule } from '@nestjs/testing';
import { DeleteDeliveryMethodHandler } from './delete-delivery-method.handler';
import { DeliveryMethodRepository } from '../../../../domain/delivery/delivery-method.repository';
import { ioCContainer } from '../../../../../../config/ioc-container';
import { EntityManager } from 'typeorm';
import { DeleteDeliveryMethodCommand } from './delete-delivery-method.command';
import { InvalidUuidFormatException } from '../../../../../common/exceptions/invalid-uuid-format.exception';
import { DeliveryMethodNotFoundException } from '../../../../domain/delivery/exceptions/delivery-method-not-found.exception';
import { DeliveryMethod } from '../../../../domain/delivery/delivery-method';
import { InternalServerErrorException } from '@nestjs/common';

describe('Delete Delivery Method Handler', () => {
  let handler: DeleteDeliveryMethodHandler;
  let deliveryMethodRepository: DeliveryMethodRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteDeliveryMethodHandler,
        ...ioCContainer,
        {
          provide: EntityManager,
          useValue: {
            getRepository: jest.fn().mockReturnThis(),
          },
        },
      ],
    }).compile();

    handler = module.get(DeleteDeliveryMethodHandler);
    deliveryMethodRepository = module.get(DeliveryMethodRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should Delete Delivery Method Handler be defined', async () => {
    expect(handler).toBeDefined();
  });

  it('should Delivery Method Repository be defined', async () => {
    expect(deliveryMethodRepository).toBeDefined();
  });

  it('should throw Invalid Uuid Format Exception if given delivery method id is not valid uuid', async () => {
    await expect(
      handler.execute(
        new DeleteDeliveryMethodCommand('invalid-delivery-method-uuid'),
      ),
    ).rejects.toThrowError(InvalidUuidFormatException);
  });

  it('should throw Delivery Method Not Found Exception if delivery method with given id does not exist in Postgres', async () => {
    jest
      .spyOn(deliveryMethodRepository, 'findOne')
      .mockImplementationOnce(() => undefined);

    await expect(
      handler.execute(
        new DeleteDeliveryMethodCommand('b1c6a6bf-39ee-46dc-8a66-5d4b6cb76c24'),
      ),
    ).rejects.toThrowError(DeliveryMethodNotFoundException);
  });

  it('should throw Internal Server Error Exception if deleting delivery method from Postgres fails', async () => {
    jest
      .spyOn(deliveryMethodRepository, 'findOne')
      .mockImplementationOnce(async () => new DeliveryMethod());
    jest
      .spyOn(deliveryMethodRepository, 'delete')
      .mockImplementationOnce(() => {
        throw new InternalServerErrorException();
      });

    await expect(
      handler.execute(
        new DeleteDeliveryMethodCommand('b1c6a6bf-39ee-46dc-8a66-5d4b6cb76c24'),
      ),
    ).rejects.toThrowError(InternalServerErrorException);
  });
});
