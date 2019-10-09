import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListOffersQuery } from './list-offers.query';
import { OfferRepository } from '../../../../domain/offer/offer.repository';
import { Offer } from '../../../../domain/offer/offer';
import { plainToClass } from 'class-transformer';
import { ListableOfferDto } from '../../../dtos/read/offer/listable-offer.dto';

@QueryHandler(ListOffersQuery)
export class ListOffersHandler implements IQueryHandler<ListOffersQuery> {
  constructor(private readonly offerRepository: OfferRepository) {}

  public async execute(query: ListOffersQuery): Promise<any> {
    const offers: Offer[] = await this.offerRepository.find(
      query.offset,
      query.limit,
      query.categoryId,
      query.sellerId,
      query.order,
    );
    return offers.map(offer => plainToClass(ListableOfferDto, offer));
  }
}
