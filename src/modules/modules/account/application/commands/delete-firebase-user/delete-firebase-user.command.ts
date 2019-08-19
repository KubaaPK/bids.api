import { Uuid } from '../../../../../common/uuid';

export class DeleteFirebaseUserCommand {
  constructor(public readonly accountId: Uuid) {}
}
