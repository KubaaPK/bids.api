import { Uuid } from '../../../../common/uuid';

export class ListIssuedReviewsQuery {
  constructor(public readonly issuerId: Uuid) {}
}
