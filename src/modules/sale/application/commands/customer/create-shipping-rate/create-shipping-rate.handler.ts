import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateShippingRateCommand } from './create-shipping-rate.command';
import { CustomerRepository } from '../../../../domain/customer/customer.repository';
import { Customer } from '../../../../domain/customer/customer';
import { ShippingRate } from '../../../../domain/customer/shipping-rate/shipping-rate';
import { DeliveryMethodRepository } from '../../../../domain/delivery/delivery-method.repository';
import { Uuid } from '../../../../../common/uuid';
import { DeliveryMethodNotFoundException } from '../../../../domain/delivery/exceptions/delivery-method-not-found.exception';
import { DeliveryMethod } from '../../../../domain/delivery/delivery-method';

@CommandHandler(CreateShippingRateCommand)
export class CreateShippingRateHandler
  implements ICommandHandler<CreateShippingRateCommand> {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly deliveryMethodRepository: DeliveryMethodRepository,
  ) {}

  private async areDeliveryMethodsExist(
    deliveryMethodsIds: Uuid[],
  ): Promise<void> {
    for (const id of deliveryMethodsIds) {
      const deliveryMethod: DeliveryMethod = await this.deliveryMethodRepository.findOne(
        id,
      );
      if (!deliveryMethod) {
        throw new DeliveryMethodNotFoundException(
          `Sposób dostawy o id: ${id} nie istnieje.`,
        );
      }
    }
  }

  public async execute(command: CreateShippingRateCommand): Promise<any> {
    if (command.newShippingRate.rates !== undefined) {
      const deliveryMethodIds: Uuid[] = command.newShippingRate.rates.map(
        el => el.deliveryMethod.id,
      );
      await this.areDeliveryMethodsExist(deliveryMethodIds);
    }

    const customer: Customer = await this.customerRepository.findOne(
      command.customerId,
    );
    const newShippingRate: ShippingRate = ShippingRate.create(
      command.newShippingRate,
    );
    await customer.createShippingRate(newShippingRate);
    await this.customerRepository.save(customer);
  }
}
