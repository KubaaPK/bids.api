import { NewAccountDto } from '../../dtos/write/new-account.dto';

export class FirebaseUserCreatedEvent {
  constructor(public readonly newAccount: NewAccountDto) {}
}
