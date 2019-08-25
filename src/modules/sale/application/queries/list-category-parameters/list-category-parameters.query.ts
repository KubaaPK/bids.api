import { Uuid } from '../../../../common/uuid';

export class ListCategoryParametersQuery {
  constructor(public readonly categoryId: Uuid) {}
}
