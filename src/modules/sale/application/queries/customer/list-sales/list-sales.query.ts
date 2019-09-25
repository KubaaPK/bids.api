import { Uuid } from '../../../../../common/uuid';

export class ListSalesQuery {
  constructor(
    public readonly sellerId: Uuid,
    public readonly offset?: number,
    public readonly limit?: number,
  ) {}
}
