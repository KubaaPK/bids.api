import { Purchase } from './purchase';
import { Uuid } from '../../../common/uuid';

export abstract class PurchaseRepository {
  public abstract async save(purchase: Purchase): Promise<Purchase>;
  public abstract async findOne(id: Uuid): Promise<Purchase | undefined>;
}
