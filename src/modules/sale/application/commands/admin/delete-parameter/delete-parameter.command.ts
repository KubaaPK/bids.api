import { Uuid } from '../../../../../common/uuid';

export class DeleteParameterCommand {
  constructor(public readonly id: Uuid) {}
}
