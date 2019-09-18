import { Uuid } from '../../../../../common/uuid';

export class RequestOfferPublicationCommand {
  constructor(
    public readonly customerId: Uuid,
    public readonly offerId: Uuid,
  ) {}
}
