import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateShippingRateCommand } from './update-shipping-rate.command';
import { CustomerRepository } from '../../../../domain/customer/customer.repository';
import { Uuid } from '../../../../../common/uuid';
import { InvalidUuidFormatException } from '../../../../../common/exceptions/invalid-uuid-format.exception';
import { Customer } from '../../../../domain/customer/customer';

@CommandHandler(UpdateShippingRateCommand)
export class UpdateShippingRateHandler
  implements ICommandHandler<UpdateShippingRateCommand> {
  constructor(private readonly customerRepository: CustomerRepository) {}

  public async execute(command: UpdateShippingRateCommand): Promise<any> {
    if (!Uuid.isUuidV4(command.updatedShippingRate.id)) {
      throw new InvalidUuidFormatException();
    }

    const customer: Customer = await this.customerRepository.findOne(
      command.customerId,
    );
    await customer.updateShippingRate(command.updatedShippingRate);

    await this.customerRepository.save(customer);
  }
}
