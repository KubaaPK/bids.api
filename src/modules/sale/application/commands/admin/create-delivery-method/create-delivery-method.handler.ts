import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateDeliveryMethodCommand } from './create-delivery-method.command';
import { DeliveryMethodRepository } from '../../../../domain/delivery/delivery-method.repository';
import { DeliveryMethod } from '../../../../domain/delivery/delivery-method';
import { DeliveryMethodAlreadyExistsException } from '../../../../domain/delivery/exceptions/delivery-method-already-exists.exception';

@CommandHandler(CreateDeliveryMethodCommand)
export class CreateDeliveryMethodHandler
  implements ICommandHandler<CreateDeliveryMethodCommand> {
  constructor(
    private readonly deliveryMethodRepository: DeliveryMethodRepository,
  ) {}

  public async execute(command: CreateDeliveryMethodCommand): Promise<any> {
    const deliveryMethod: DeliveryMethod = await this.deliveryMethodRepository.findOne(
      command.newDeliveryMethod.name,
    );

    if (
      deliveryMethod !== undefined &&
      deliveryMethod.name === command.newDeliveryMethod.name &&
      deliveryMethod.paymentPolicy === command.newDeliveryMethod.paymentPolicy
    ) {
      throw new DeliveryMethodAlreadyExistsException();
    }

    const newDeliveryMethod: DeliveryMethod = DeliveryMethod.create(
      command.newDeliveryMethod,
    );
    await this.deliveryMethodRepository.save(newDeliveryMethod);
  }
}
