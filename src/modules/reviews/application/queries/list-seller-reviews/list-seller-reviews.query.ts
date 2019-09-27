import { Uuid } from '../../../../common/uuid';

export class ListSellerReviewsQuery {
  constructor(public readonly sellerId: Uuid) {}
}
