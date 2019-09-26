import { Uuid } from '../../../../common/uuid';

export class RequestAddReviewCommand {
  constructor(
    public readonly buyerId: Uuid,
    public readonly purchaseId: Uuid,
  ) {}
}
