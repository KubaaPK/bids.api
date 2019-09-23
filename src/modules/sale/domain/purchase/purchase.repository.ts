import { Purchase } from './purchase';

export abstract class PurchaseRepository {
  public abstract async save(purchase: Purchase): Promise<Purchase>;
}
