import { Injectable } from '@nestjs/common';
import { AppLogger } from '../../../../common/app-logger';
import { AccountRepository } from '../../../domain/account.repository';
import { Uuid } from '../../../../common/uuid';

@Injectable()
export class AccountInformationService {
  private readonly logger: AppLogger = new AppLogger(
    AccountInformationService.name,
    true,
  );

  constructor(private readonly accountRepository: AccountRepository) {}

  public async getUsername(id: Uuid): Promise<string> {
    try {
      return (await this.accountRepository.findOne(id)).username;
    } catch (e) {
      this.logger.error(e.message);
    }
  }
}
