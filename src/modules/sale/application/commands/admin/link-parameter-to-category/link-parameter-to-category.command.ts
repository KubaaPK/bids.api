import { Uuid } from '../../../../../common/uuid';

export class LinkParameterToCategoryCommand {
  constructor(
    public readonly categoryId: Uuid,
    public readonly parameterId: Uuid,
  ) {}
}
