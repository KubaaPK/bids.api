import { Uuid } from '../../../../../common/uuid';
import { Offer } from '../../../../domain/offer/offer';

export class SaveSaleCommand {
  constructor(public readonly offer: Offer, public readonly purchaseId: Uuid) {}
}
