import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddReviewCommand } from './add-review.command';
import { PurchaseRepository } from '../../../../sale/domain/purchase/purchase.repository';
import { ReviewRepository } from '../../../domain/review.repository';
import { Purchase } from '../../../../sale/domain/purchase/purchase';
import {
  ConflictException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Review } from '../../../domain/review';
import { ReviewRequestRepository } from '../../../domain/review-request.repository';
import { Uuid } from '../../../../common/uuid';

@CommandHandler(AddReviewCommand)
export class AddReviewHandler implements ICommandHandler<AddReviewCommand> {
  constructor(
    private readonly purchaseRepository: PurchaseRepository,
    private readonly reviewRepository: ReviewRepository,
    private readonly reviewRequestRepository: ReviewRequestRepository,
  ) {}

  public async execute(command: AddReviewCommand): Promise<void> {
    const { newReview } = command;

    const purchase: Purchase = await this.purchaseRepository.findOne(
      newReview.purchaseId,
    );
    if (!purchase) {
      throw new NotFoundException('Zakup o podanym ID nie istnieje.');
    }

    if ((await purchase.buyer).id !== newReview.reviewerId) {
      throw new UnprocessableEntityException(
        'Nie jesteś właścicielem podanego zakupu.',
      );
    }

    const isReviewExist: Review = await this.reviewRepository.findOne(
      newReview.purchaseId,
      newReview.reviewerId,
    );
    if (isReviewExist) {
      throw new ConflictException(
        'Ocena do podanej płatności została już dodana.',
      );
    }

    const sellerId: Uuid = (await (await purchase.offer).customer).id;
    const review: Review = Review.create(
      newReview.id,
      newReview.rateType,
      newReview.reviewerId,
      sellerId,
      newReview.purchaseId,
    );
    review.attachRating(newReview.rating);
    await this.reviewRepository.save(review);
    await this.reviewRequestRepository.delete(
      newReview.purchaseId,
      newReview.reviewerId,
    );
  }
}
