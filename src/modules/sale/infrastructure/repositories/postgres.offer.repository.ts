import { OfferRepository } from '../../domain/offer/offer.repository';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Offer } from '../../domain/offer/offer';
import { AppLogger } from '../../../common/app-logger';
import { EntityManager, IsNull, Like, Not, Raw, Repository } from 'typeorm';
import { ExceptionMessages } from '../../../common/exception-messages';
import { Uuid } from '../../../common/uuid';
import { OfferStatus } from '../../domain/offer/offer-status';

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

  public async find(
    offset?: number,
    limit?: number,
    categoryId?: Uuid,
    sellerId?: Uuid,
    order?: string,
    title?: string,
  ): Promise<[Offer[], number]> {
    try {
      return await this.repository.findAndCount({
        take: limit,
        skip: offset,
        relations: ['category', 'customer', 'shippingRate'],
        where: {
          category: {
            id: categoryId || Not(IsNull()),
          },
          name: title === undefined ? Like(`%%`) : Like(`%${title}%`),
          status: OfferStatus.ACTIVE,
          customer: {
            id: sellerId || Not(IsNull()),
          },
        },
        order: {
          createdAt: order as 'ASC' | 'DESC',
        },
      });
    } catch (e) {
      this.logger.error(e.message);
      throw new InternalServerErrorException(
        ExceptionMessages.GENERIC_INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async findOne(id: Uuid): Promise<Offer | undefined> {
    try {
      return await this.repository.findOne(id, {
        relations: ['category', 'customer', 'shippingRate', 'category.parent'],
      });
    } catch (e) {
      this.logger.error(e.message);
      throw new InternalServerErrorException(
        ExceptionMessages.GENERIC_INTERNAL_SERVER_ERROR,
      );
    }
  }
}
