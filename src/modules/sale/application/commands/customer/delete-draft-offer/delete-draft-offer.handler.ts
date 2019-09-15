import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteDraftOfferCommand } from './delete-draft-offer.command';
import { CustomerRepository } from '../../../../domain/customer/customer.repository';
import { Customer } from '../../../../domain/customer/customer';

@CommandHandler(DeleteDraftOfferCommand)
export class DeleteDraftOfferHandler
  implements ICommandHandler<DeleteDraftOfferCommand> {
  constructor(private readonly customerRepository: CustomerRepository) {}

  public async execute(command: DeleteDraftOfferCommand): Promise<any> {
    const customer: Customer = await this.customerRepository.findOne(
      command.customerId,
    );
    await customer.deleteDraftOffer(command.offerId);
    await this.customerRepository.save(customer);
  }
}
