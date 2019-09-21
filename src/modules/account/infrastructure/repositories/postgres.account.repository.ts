import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { AccountRepository } from '../../domain/account.repository';
import { AppLogger } from '../../../common/app-logger';
import { Account } from '../../domain/account';
import { ExceptionMessages } from '../../../common/exception-messages';
import { Uuid } from '../../../common/uuid';

@Injectable()
export class PostgresAccountRepository implements AccountRepository {
  private readonly logger: AppLogger = new AppLogger(
    PostgresAccountRepository.name,
    true,
  );
  private readonly repository: Repository<Account>;

  constructor(private readonly manager: EntityManager) {
    this.repository = this.manager.getRepository(Account);
  }

  public async save(account: Account): Promise<Account> {
    try {
      return await this.repository.save(account);
    } catch (e) {
      this.logger.error(e.message);
      throw new InternalServerErrorException(
        ExceptionMessages.GENERIC_INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async findOne(arg: string | Uuid): Promise<Account | undefined> {
    try {
      if (Uuid.isUuidV4(arg)) {
        return await this.repository.findOne(arg as Uuid);
      }
      return await this.repository.findOne({
        where: { username: arg },
      });
    } catch (e) {
      this.logger.error(e.message);
      throw new InternalServerErrorException(
        ExceptionMessages.GENERIC_INTERNAL_SERVER_ERROR,
      );
    }
  }
}
