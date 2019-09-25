import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SaleRepository } from '../../domain/sale/sale.repository';
import { Sale } from '../../domain/sale/sale';
import { Uuid } from '../../../common/uuid';
import { AppLogger } from '../../../common/app-logger';
import { EntityManager, Repository } from 'typeorm';
import { ExceptionMessages } from '../../../common/exception-messages';

@Injectable()
export class PostgresSaleRepository implements SaleRepository {
  private readonly logger: AppLogger = new AppLogger(
    PostgresSaleRepository.name,
    true,
  );
  private readonly repository: Repository<Sale>;

  constructor(private readonly manager: EntityManager) {
    this.repository = manager.getRepository(Sale);
  }

  public async find(sellerId: Uuid): Promise<Sale[]> {
    try {
      return await this.repository.find({
        where: {
          seller: {
            id: sellerId,
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

  public async save(sold: Sale): Promise<Sale> {
    try {
      return await this.repository.save(sold);
    } catch (e) {
      this.logger.error(e.message);
      throw new InternalServerErrorException(
        ExceptionMessages.GENERIC_INTERNAL_SERVER_ERROR,
      );
    }
  }
}
