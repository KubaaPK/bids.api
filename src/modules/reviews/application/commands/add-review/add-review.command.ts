import { NewReviewDto } from '../../dtos/write/new-review.dto';

export class AddReviewCommand {
  constructor(public readonly newReview: NewReviewDto) {}
}
