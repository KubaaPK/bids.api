import { AccountRepository } from '../modules/modules/account/domain/account.repository';
import { PostgresAccountRepository } from '../modules/modules/account/infrastructure/repositories/postgres.account.repository';
import { Provider } from '@nestjs/common';

export const ioCContainer: Provider<any>[] = [
  {
    provide: AccountRepository,
    useClass: PostgresAccountRepository,
  },
];
