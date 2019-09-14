import { Uuid } from '../../../../../common/uuid';
import { UpdatedDraftOfferDto } from '../../../dtos/write/offer/updated-draft-offer.dto';

export class UpdateDraftOfferCommand {
  constructor(
    public readonly offerId: Uuid,
    public readonly updatedDraftOffer: UpdatedDraftOfferDto,
  ) {}
}
