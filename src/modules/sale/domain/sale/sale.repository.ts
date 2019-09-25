import { Sale } from './sale';
import { Uuid } from '../../../common/uuid';

export abstract class SaleRepository {
  public abstract async save(sold: Sale): Promise<Sale>;
  public abstract async find(sellerId: Uuid): Promise<Sale[]>;
}
