import { NewAccountDto } from '../../dtos/write/new-account.dto';

export class CreatePostgresAccountCommand {
  constructor(public readonly newAccount: NewAccountDto) {}
}
