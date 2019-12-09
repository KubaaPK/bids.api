import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { plainToClass } from 'class-transformer';
import { ListIssuedReviewsQuery } from './list-issued-reviews.query';
import { ReviewRepository } from '../../../domain/review.repository';
import { Review } from '../../../domain/review';
import { ListableIssuedReviewDto } from '../../dtos/read/issued-reviews/listable-issued-review.dto';

@QueryHandler(ListIssuedReviewsQuery)
export class ListIssuedReviewsHandler
  implements IQueryHandler<ListIssuedReviewsQuery> {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  public async execute(
    query: ListIssuedReviewsQuery,
  ): Promise<ListableIssuedReviewDto[]> {
    const reviews: Review[] = await this.reviewRepository.findIssuedReviews(
      query.issuerId,
    );

    return reviews.map<ListableIssuedReviewDto>(review =>
      plainToClass(ListableIssuedReviewDto, review),
    );
  }
}
