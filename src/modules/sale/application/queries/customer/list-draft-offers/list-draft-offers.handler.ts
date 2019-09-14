import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListDraftOffersQuery } from './list-draft-offers.query';
import { CustomerRepository } from '../../../../domain/customer/customer.repository';
import { Customer } from '../../../../domain/customer/customer';
import { Offer } from '../../../../domain/offer/offer';
import { deserializeArray, plainToClass } from 'class-transformer';
import { ListableDraftOfferDto } from '../../../dtos/read/listable-draft-offer.dto';

@QueryHandler(ListDraftOffersQuery)
export class ListDraftOffersHandler
  implements IQueryHandler<ListDraftOffersQuery> {
  constructor(private readonly customerRepository: CustomerRepository) {}

  public async execute(
    query: ListDraftOffersQuery,
  ): Promise<ListableDraftOfferDto[]> {
    const customer: Customer = await this.customerRepository.findOne(
      query.customerId,
    );

    const draftOffers: Offer[] = await customer.listDraftOffers(
      query.offset,
      query.limit,
    );

    await this.resolveLazyPromises(draftOffers);
    return draftOffers.map<ListableDraftOfferDto>((offer: Offer) => {
      return plainToClass(ListableDraftOfferDto, offer);
    });
  }

  private async resolveLazyPromises(offers: Offer[]): Promise<void> {
    for (let i = 0; i < offers.length; i += 1) {
      await offers[i].category;
      await offers[i].shippingRate;
    }
  }
}
