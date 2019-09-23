import { PurchaseRepository } from '../../domain/purchase/purchase.repository';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Purchase } from '../../domain/purchase/purchase';
import { AppLogger } from '../../../common/app-logger';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class PostgresPurchaseRepository implements PurchaseRepository {
  private readonly logger: AppLogger = new AppLogger(
    PostgresPurchaseRepository.name,
    true,
  );
  private readonly repository: Repository<Purchase>;

  constructor(private readonly manager: EntityManager) {
    this.repository = manager.getRepository(Purchase);
  }

  public async save(purchase: Purchase): Promise<Purchase> {
    try {
      return await this.repository.save(purchase);
    } catch (e) {
      this.logger.error(e.message);
      throw new InternalServerErrorException();
    }
  }
}
