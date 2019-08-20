import { AccountRepository } from '../modules/modules/account/domain/account.repository';
import { PostgresAccountRepository } from '../modules/modules/account/infrastructure/repositories/postgres.account.repository';
import { Provider } from '@nestjs/common';
import { CategoryRepository } from '../modules/modules/sale/domain/category/category.repository';
import { PostgresCategoryRepository } from '../modules/modules/sale/infrastructure/repositories/postgres.category.repository';

export const ioCContainer: Provider<any>[] = [
  {
    provide: AccountRepository,
    useClass: PostgresAccountRepository,
  },
  {
    provide: CategoryRepository,
    useClass: PostgresCategoryRepository,
  },
];
