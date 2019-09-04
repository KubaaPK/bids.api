import { Uuid } from '../../../../common/uuid';

export class AccountCreatedEvent {
  public constructor(
    public readonly accountId: Uuid,
    public readonly createdAt: Date,
  ) {}
}
