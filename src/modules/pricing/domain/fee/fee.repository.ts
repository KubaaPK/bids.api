import { Fee } from './fee';

export abstract class FeeRepository {
  public abstract async save(fee: Fee): Promise<Fee>;
}
