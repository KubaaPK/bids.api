import { Uuid } from '../../../../common/uuid';

export class ListPurchasesToEvaluateQuery {
  constructor(public readonly customerId: Uuid) {}
}
