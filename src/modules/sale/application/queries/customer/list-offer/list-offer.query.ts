import { Uuid } from '../../../../../common/uuid';
import { InvalidUuidFormatException } from '../../../../../common/exceptions/invalid-uuid-format.exception';

export class ListOfferQuery {
  constructor(public readonly offerId: Uuid) {
    if (!Uuid.isUuidV4(offerId)) {
      throw new InvalidUuidFormatException();
    }
  }
}
