import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { AccountCreatedEvent } from '../../../../account/application/events/account-created/account-created.event';
import { CustomerRepository } from '../../../domain/customer/customer.repository';
import { Customer } from '../../../domain/customer/customer';

@EventsHandler(AccountCreatedEvent)
export class AccountCreatedEventHandler
  implements IEventHandler<AccountCreatedEvent> {
  constructor(private readonly customerRepository: CustomerRepository) {}

  public async handle(event: AccountCreatedEvent): Promise<void> {
    const newCustomer: Customer = Customer.create(event.accountId);
    await this.customerRepository.save(newCustomer);
  }
}
