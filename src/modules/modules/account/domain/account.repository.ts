import { Account } from './account';

export abstract class AccountRepository {
  public abstract async save(account: Account): Promise<Account>;
  public abstract async findOne(username: string): Promise<Account | undefined>;
}
