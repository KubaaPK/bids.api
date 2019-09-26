import { ReviewRepository } from '../../domain/review.repository';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Review } from '../../domain/review';
import { AppLogger } from '../../../common/app-logger';
import { EntityManager, Repository } from 'typeorm';
import { ExceptionMessages } from '../../../common/exception-messages';
import { Uuid } from '../../../common/uuid';

@Injectable()
export class PostgresReviewRepository implements ReviewRepository {
  private readonly logger: AppLogger = new AppLogger(
    PostgresReviewRepository.name,
    true,
  );
  private readonly repository: Repository<Review>;

  constructor(private readonly manager: EntityManager) {
    this.repository = manager.getRepository(Review);
  }

  public async save(review: Review): Promise<Review> {
    try {
      return await this.repository.save(review);
    } catch (e) {
      this.logger.error(e.message);
      throw new InternalServerErrorException(
        ExceptionMessages.GENERIC_INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async findOne(id: Uuid): Promise<Review | undefined>;
  public async findOne(
    id: Uuid,
    purchaseId: Uuid,
    reviewerId: Uuid,
  ): Promise<Review | undefined>;
  public async findOne(
    id: Uuid,
    purchaseId?: Uuid,
    reviewerId?: Uuid,
  ): Promise<Review | undefined> {
    if (typeof purchaseId === 'number' && typeof reviewerId === 'number') {
      try {
        return await this.repository.findOne({
          where: {
            purchase: {
              id: purchaseId,
            },
            reviewer: {
              id: reviewerId,
            },
          },
        });
      } catch (e) {
        this.logger.error(e.message);
        throw new InternalServerErrorException(
          ExceptionMessages.GENERIC_INTERNAL_SERVER_ERROR,
        );
      }
    }
    try {
      return await this.repository.findOne(id);
    } catch (e) {
      this.logger.error(e.message);
      throw new InternalServerErrorException(
        ExceptionMessages.GENERIC_INTERNAL_SERVER_ERROR,
      );
    }
  }
}
