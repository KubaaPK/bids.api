import { Uuid } from '../../../../../../modules/common/uuid';

export class ListPurchasesQuery {
  constructor(public readonly customerId: Uuid) {}
}
