import { Uuid } from '../../../../../common/uuid';

export class DeleteDraftOfferCommand {
  constructor(
    public readonly customerId: Uuid,
    public readonly offerId: Uuid,
  ) {}
}
