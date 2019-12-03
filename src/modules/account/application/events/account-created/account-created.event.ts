import { Uuid } from '../../../../common/uuid';

export class AccountCreatedEvent {
  public constructor(
    public readonly accountId: Uuid,
    public readonly username: string,
    public readonly createdAt: Date,
  ) {}
}
