import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateDeliveryMethodCommand } from './update-delivery-method.command';
import { DeliveryMethodRepository } from '../../../../domain/delivery/delivery-method.repository';
import { Uuid } from '../../../../../common/uuid';
import { InvalidUuidFormatException } from '../../../../../common/exceptions/invalid-uuid-format.exception';
import { DeliveryMethod } from '../../../../domain/delivery/delivery-method';
import { DeliveryMethodNotFoundException } from '../../../../domain/delivery/exceptions/delivery-method-not-found.exception';

@CommandHandler(UpdateDeliveryMethodCommand)
export class UpdateDeliveryMethodHandler
  implements ICommandHandler<UpdateDeliveryMethodCommand> {
  constructor(
    private readonly deliveryMethodRepository: DeliveryMethodRepository,
  ) {}

  public async execute(command: UpdateDeliveryMethodCommand): Promise<void> {
    if (!Uuid.isUuidV4(command.deliveryMethodId)) {
      throw new InvalidUuidFormatException();
    }

    const deliveryMethod: DeliveryMethod = await this.deliveryMethodRepository.findOne(
      command.deliveryMethodId,
    );
    if (!deliveryMethod) {
      throw new DeliveryMethodNotFoundException();
    }

    deliveryMethod.update(command.updatedDeliveryMethod);
    await this.deliveryMethodRepository.save(deliveryMethod);
  }
}
