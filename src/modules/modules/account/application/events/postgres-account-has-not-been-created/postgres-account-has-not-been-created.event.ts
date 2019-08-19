import { Uuid } from '../../../../../common/uuid';

export class PostgresAccountHasNotBeenCreatedEvent {
  constructor(public readonly accountId: Uuid) {}
}
