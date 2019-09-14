import { Uuid } from '../../../../../common/uuid';

export class ListDraftOffersQuery {
  constructor(
    public readonly customerId: Uuid,
    public readonly offset?: number,
    public readonly limit?: number,
  ) {}
}
