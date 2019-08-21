import { Uuid } from '../../../../../../common/uuid';

export class DeleteCategoryCommand {
  constructor(public readonly id: Uuid) {}
}
