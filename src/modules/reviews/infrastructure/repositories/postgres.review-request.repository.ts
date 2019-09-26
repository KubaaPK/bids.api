import { ReviewRequestRepository } from '../../domain/review-request.repository';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ReviewRequest } from '../../domain/review-request';
import { AppLogger } from '../../../common/app-logger';
import { EntityManager, Repository } from 'typeorm';
import { ExceptionMessages } from '../../../common/exception-messages';
import { Uuid } from '../../../common/uuid';

@Injectable()
export class PostgresReviewRequestRepository
  implements ReviewRequestRepository {
  private readonly logger: AppLogger = new AppLogger(
    PostgresReviewRequestRepository.name,
    true,
  );
  private readonly repository: Repository<ReviewRequest>;

  constructor(private readonly manager: EntityManager) {
    this.repository = manager.getRepository(ReviewRequest);
  }

  public async save(reviewRequest: ReviewRequest): Promise<ReviewRequest> {
    try {
      return await this.repository.save(reviewRequest);
    } catch (e) {
      this.logger.error(e.message);
      throw new InternalServerErrorException(
        ExceptionMessages.GENERIC_INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async delete(purchaseId: Uuid, buyerId: Uuid): Promise<void> {
    try {
      await this.repository.delete({
        purchase: {
          id: purchaseId,
        },
        buyer: {
          id: buyerId,
        },
      });
    } catch (e) {
      this.logger.error(e.message);
      throw new InternalServerErrorException(
        ExceptionMessages.GENERIC_INTERNAL_SERVER_ERROR,
      );
    }
  }
}
