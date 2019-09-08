import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateDraftOfferCommand } from './create-draft-offer.command';
import { CustomerRepository } from '../../../../domain/customer/customer.repository';
import { OfferRepository } from '../../../../domain/offer/offer.repository';
import { Customer } from '../../../../domain/customer/customer';

@CommandHandler(CreateDraftOfferCommand)
export class CreateDraftOfferHandler
  implements ICommandHandler<CreateDraftOfferCommand> {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly offerRepository: OfferRepository,
  ) {}

  public async execute(command: CreateDraftOfferCommand): Promise<any> {
    const customer: Customer = await this.customerRepository.findOne(
      command.newDraftOffer.customer.uid,
    );
  }
}
