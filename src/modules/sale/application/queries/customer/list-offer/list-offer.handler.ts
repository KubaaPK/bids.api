import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListOfferQuery } from './list-offer.query';
import { OfferRepository } from '../../../../domain/offer/offer.repository';
import { NotFoundException } from '@nestjs/common';
import { Offer } from '../../../../domain/offer/offer';
import { plainToClass } from 'class-transformer';
import { ListableSingleOfferDto } from '../../../dtos/read/offer/listable-single-offer.dto';
import { AccountInformationService } from '../../../../../account/application/services/account-information/account-information.service';

@QueryHandler(ListOfferQuery)
export class ListOfferHandler implements IQueryHandler<ListOfferQuery> {
  constructor(
    private readonly offerRepository: OfferRepository,
    private readonly accountInformationService: AccountInformationService,
  ) {}

  public async execute(query: ListOfferQuery): Promise<ListableSingleOfferDto> {
    const offer: Offer = await this.offerRepository.findOne(query.offerId);
    if (!offer) {
      throw new NotFoundException('Oferta o podanym ID nie istnieje.');
    }

    offer.customer = Object.assign(offer.customer, {
      username: await this.accountInformationService.getUsername(
        offer.customer.id,
      ),
    });
    return plainToClass(ListableSingleOfferDto, offer);
  }
}
