import { NewAccountDto } from '../application/dtos/write/new-account.dto';

export abstract class AccountFactory {
  public abstract async create(dto: NewAccountDto): Promise<Account>;
}
