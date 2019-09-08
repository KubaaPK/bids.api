import { OfferRepository } from '../../domain/offer/offer.repository';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Offer } from '../../domain/offer/offer';
import { AppLogger } from '../../../common/app-logger';
import { EntityManager, Repository } from 'typeorm';
import { ExceptionMessages } from '../../../common/exception-messages';

@Injectable()
export class PostgresOfferRepository implements OfferRepository {
  private readonly logger: AppLogger = new AppLogger(
    PostgresOfferRepository.name,
    true,
  );

  private readonly repository: Repository<Offer>;

  constructor(private readonly manager: EntityManager) {
    this.repository = this.manager.getRepository(Offer);
  }

  public async save(offer: Offer): Promise<Offer> {
    try {
      return await this.repository.save(offer);
    } catch (e) {
      this.logger.error(e.message);
      throw new InternalServerErrorException(
        ExceptionMessages.GENERIC_INTERNAL_SERVER_ERROR,
      );
    }
  }
}
