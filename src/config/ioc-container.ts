import { AccountRepository } from '../modules/account/domain/account.repository';
import { PostgresAccountRepository } from '../modules/account/infrastructure/repositories/postgres.account.repository';
import { Provider } from '@nestjs/common';
import { CategoryRepository } from '../modules/sale/domain/category/category.repository';
import { PostgresCategoryRepository } from '../modules/sale/infrastructure/repositories/postgres.category.repository';
import { ParameterRepository } from '../modules/sale/domain/category/parameter.repository';
import { PostgresParameterRepository } from '../modules/sale/infrastructure/repositories/postgres.parameter.repository';
import { DeliveryMethodRepository } from '../modules/sale/domain/delivery/delivery-method.repository';
import { PostgresDeliveryMethodRepository } from '../modules/sale/infrastructure/repositories/postgres.delivery-method.repository';

export const ioCContainer: Provider<any>[] = [
  {
    provide: AccountRepository,
    useClass: PostgresAccountRepository,
  },
  {
    provide: CategoryRepository,
    useClass: PostgresCategoryRepository,
  },
  {
    provide: ParameterRepository,
    useClass: PostgresParameterRepository,
  },
  {
    provide: DeliveryMethodRepository,
    useClass: PostgresDeliveryMethodRepository,
  },
];
