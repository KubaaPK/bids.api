import { Review } from './review';
import { Uuid } from '../../common/uuid';

export abstract class ReviewRepository {
  public abstract async save(review: Review): Promise<Review>;
  public abstract async findOne(id: Uuid): Promise<Review | undefined>;
  public abstract async findOne(
    purchaseId: Uuid,
    reviewerId: Uuid,
  ): Promise<Review | undefined>;
}
