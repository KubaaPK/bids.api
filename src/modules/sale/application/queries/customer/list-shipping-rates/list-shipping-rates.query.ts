import { Uuid } from '../../../../../common/uuid';

export class ListShippingRatesQuery {
  constructor(public readonly customerId: Uuid) {}
}
