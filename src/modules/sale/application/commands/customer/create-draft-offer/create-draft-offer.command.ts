import { NewDraftOfferDto } from '../../../dtos/write/offer/new-draft-offer.dto';

export class CreateDraftOfferCommand {
  constructor(public readonly newDraftOffer: NewDraftOfferDto) {}
}
