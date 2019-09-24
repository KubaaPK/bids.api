import { Offer } from '../../../../domain/offer/offer';

export class UpdateOfferProductStockCommand {
  constructor(public readonly offer: Offer, public readonly amount: number) {}
}
