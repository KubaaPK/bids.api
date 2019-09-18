import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RequestOfferPublicationCommand } from './request-offer-publication.command';
import { CustomerRepository } from '../../../../domain/customer/customer.repository';
import { DraftOfferValidator } from '../../../services/draft-offer-validator/draft-offer-validator';
import { Customer } from '../../../../domain/customer/customer';
import { Offer } from '../../../../domain/offer/offer';
import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

@CommandHandler(RequestOfferPublicationCommand)
export class RequestOfferPublicationHandler
  implements ICommandHandler<RequestOfferPublicationCommand> {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly draftOfferValidator: DraftOfferValidator,
  ) {}

  public async execute(command: RequestOfferPublicationCommand): Promise<void> {
    const customer: Customer = await this.customerRepository.findOne(
      command.customerId,
    );

    const draftOffer: Offer = (await customer.offers).find(
      (offer: Offer) => offer.id === command.offerId,
    );
    if (!draftOffer) {
      throw new NotFoundException('Oferta o podanym ID nie istnieje.');
    }
    const draftOfferIndex: number = (await customer.offers).findIndex(
      (offer: Offer) => offer.id === command.offerId,
    );

    const validationErrors: string[] = this.draftOfferValidator.validate(
      draftOffer,
    );
    if (validationErrors.length > 0) {
      throw new UnprocessableEntityException(validationErrors);
    }

    await customer.publishOffer(draftOfferIndex);
    await this.customerRepository.save(customer);
  }
}
