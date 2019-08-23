import { NewAccountDto } from '../../dtos/write/new-account.dto';

export class CreateFirebaseUserCommand {
  constructor(public readonly newAccount: NewAccountDto) {}
}
