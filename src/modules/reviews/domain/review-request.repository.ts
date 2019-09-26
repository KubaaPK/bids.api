import { ReviewRequest } from './review-request';
import { Uuid } from '../../common/uuid';

export abstract class ReviewRequestRepository {
  public abstract async save(
    reviewRequest: ReviewRequest,
  ): Promise<ReviewRequest>;
  public abstract async delete(purchaseId: Uuid, buyerId: Uuid): Promise<void>;
}
