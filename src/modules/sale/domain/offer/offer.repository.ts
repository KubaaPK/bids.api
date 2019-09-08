import { Offer } from './offer';

export abstract class OfferRepository {
  public abstract async save(offer: Offer): Promise<Offer>;
}
