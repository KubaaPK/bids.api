import { Fee } from './fee';
import { Uuid } from '../../../common/uuid';

export abstract class FeeRepository {
  public abstract async save(fee: Fee): Promise<Fee>;
  public abstract async find(
    debtorId: Uuid,
    offset?: number,
    limit?: number,
  ): Promise<Fee[]>;
}
