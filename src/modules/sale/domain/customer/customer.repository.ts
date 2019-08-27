import { Uuid } from '../../../common/uuid';
import { Customer } from './customer';

export abstract class CustomerRepository {
  public abstract async findOne(id: Uuid): Promise<Customer | undefined>;
  public abstract async save(customer: Customer): Promise<Customer>;
}
