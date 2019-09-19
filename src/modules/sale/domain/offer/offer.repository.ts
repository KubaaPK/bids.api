import { Offer } from './offer';
import { Uuid } from '../../../common/uuid';

export abstract class OfferRepository {
  public abstract async save(offer: Offer): Promise<Offer>;
  public abstract async find(
    offset?: number,
    limit?: number,
    categoryId?: Uuid,
    sellerId?: Uuid,
  ): Promise<Offer[]>;
}
