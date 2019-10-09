import { Uuid } from '../../../../../common/uuid';

export class ListOffersQuery {
  constructor(
    public readonly offset?: number,
    public readonly limit?: number,
    public readonly categoryId?: Uuid,
    public readonly sellerId?: Uuid,
    public readonly order?: string,
  ) {}
}
