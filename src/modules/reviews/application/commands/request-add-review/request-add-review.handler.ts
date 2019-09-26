import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RequestAddReviewCommand } from './request-add-review.command';
import { ReviewRequestRepository } from '../../../domain/review-request.repository';
import { ReviewRequest } from '../../../domain/review-request';

@CommandHandler(RequestAddReviewCommand)
export class RequestAddReviewHandler
  implements ICommandHandler<RequestAddReviewCommand> {
  constructor(
    private readonly reviewRequestRepository: ReviewRequestRepository,
  ) {}

  public async execute(command: RequestAddReviewCommand): Promise<any> {
    const request: ReviewRequest = ReviewRequest.create(
      command.buyerId,
      command.purchaseId,
    );
    await this.reviewRequestRepository.save(request);
  }
}
