import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteShippingRateCommand } from './delete-shipping-rate.command';
import { CustomerRepository } from '../../../../domain/customer/customer.repository';
import { Customer } from '../../../../domain/customer/customer';
import { Uuid } from '../../../../../common/uuid';
import { InvalidUuidFormatException } from '../../../../../common/exceptions/invalid-uuid-format.exception';

@CommandHandler(DeleteShippingRateCommand)
export class DeleteShippingRateHandler
  implements ICommandHandler<DeleteShippingRateCommand> {
  constructor(private readonly customerRepository: CustomerRepository) {}

  public async execute(command: DeleteShippingRateCommand): Promise<any> {
    if (!Uuid.isUuidV4(command.shippingRateId)) {
      throw new InvalidUuidFormatException();
    }

    const customer: Customer = await this.customerRepository.findOne(
      command.customerId,
    );
    await customer.deleteShippingRate(command.shippingRateId);

    await this.customerRepository.save(customer);
  }
}
