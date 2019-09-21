import { Account } from './account';
import { Uuid } from '../../common/uuid';

export abstract class AccountRepository {
  public abstract async save(account: Account): Promise<Account>;
  public abstract async findOne(
    arg: string | Uuid,
  ): Promise<Account | undefined>;
}
