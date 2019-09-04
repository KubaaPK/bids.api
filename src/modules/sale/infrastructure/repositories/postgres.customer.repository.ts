import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CustomerRepository } from '../../domain/customer/customer.repository';
import { AppLogger } from '../../../common/app-logger';
import { EntityManager, Repository } from 'typeorm';
import { Customer } from '../../domain/customer/customer';
import { ExceptionMessages } from '../../../common/exception-messages';
import { Uuid } from '../../../common/uuid';

@Injectable()
export class PostgresCustomerRepository implements CustomerRepository {
  private readonly logger: AppLogger = new AppLogger(
    PostgresCustomerRepository.name,
    true,
  );

  private readonly repository: Repository<Customer>;

  constructor(private readonly manager: EntityManager) {
    this.repository = this.manager.getRepository(Customer);
  }

  public async findOne(id: Uuid): Promise<Customer | undefined> {
    try {
      return await this.repository.findOne(id);
    } catch (e) {
      this.logger.error(e.message);
      throw new InternalServerErrorException(
        ExceptionMessages.GENERIC_INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async save(customer: Customer): Promise<Customer> {
    try {
      return await this.repository.save(customer);
    } catch (e) {
      this.logger.error(e.message);
      throw new InternalServerErrorException(
        ExceptionMessages.GENERIC_INTERNAL_SERVER_ERROR,
      );
    }
  }
}
