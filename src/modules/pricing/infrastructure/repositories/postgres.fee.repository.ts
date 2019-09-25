import { FeeRepository } from '../../domain/fee/fee.repository';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Fee } from '../../domain/fee/fee';
import { AppLogger } from '../../../common/app-logger';
import { EntityManager, Repository } from 'typeorm';
import { ExceptionMessages } from '../../../common/exception-messages';
import { Uuid } from '../../../common/uuid';

@Injectable()
export class PostgresFeeRepository implements FeeRepository {
  private readonly logger: AppLogger = new AppLogger(
    PostgresFeeRepository.name,
    true,
  );
  private readonly repository: Repository<Fee>;

  constructor(private readonly manager: EntityManager) {
    this.repository = manager.getRepository(Fee);
  }

  public async save(fee: Fee): Promise<Fee> {
    try {
      return await this.repository.save(fee);
    } catch (e) {
      this.logger.error(e.message);
      throw new InternalServerErrorException(
        ExceptionMessages.GENERIC_INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async find(
    debtorId: Uuid,
    offset?: number,
    limit?: number,
  ): Promise<Fee[]> {
    try {
      return await this.repository.find({
        relations: ['purchase'],
        where: {
          debtor: {
            id: debtorId,
          },
        },
        take: limit,
        skip: offset,
      });
    } catch (e) {
      this.logger.error(e.message);
      throw new InternalServerErrorException(
        ExceptionMessages.GENERIC_INTERNAL_SERVER_ERROR,
      );
    }
  }
}
