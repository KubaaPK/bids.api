import { NewAccountDto } from '../../dtos/write/new-account.dto';

export class CreateAccountCommand {
  public constructor(public readonly newAccount: NewAccountDto) {}
}
