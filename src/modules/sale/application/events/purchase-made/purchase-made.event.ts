import { Uuid } from '../../../../common/uuid';
import { Offer } from '../../../domain/offer/offer';

export class PurchaseMadeEvent {
  constructor(
    public readonly buyerId: Uuid,
    public readonly purchaseId: Uuid,
    public readonly amount: number,
    public readonly offer: Offer,
  ) {}
}
