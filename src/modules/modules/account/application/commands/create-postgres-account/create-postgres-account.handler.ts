import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreatePostgresAccountCommand } from './create-postgres-account.command';
import { AccountRepository } from '../../../domain/account.repository';
import { Account } from '../../../domain/account';
import { PostgresAccountHasNotBeenCreatedEvent } from '../../events/postgres-account-has-not-been-created/postgres-account-has-not-been-created.event';

@CommandHandler(CreatePostgresAccountCommand)
export class CreatePostgresAccountHandler
  implements ICommandHandler<CreatePostgresAccountCommand> {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async execute(command: CreatePostgresAccountCommand): Promise<any> {
    const newAccount: Account = Account.create(command.newAccount);
    const existingAccount:
      | Account
      | undefined = await this.accountRepository.findOne(
      command.newAccount.username,
    );
    if (existingAccount) {
      this.eventBus.publish(
        new PostgresAccountHasNotBeenCreatedEvent(newAccount.id),
      );
    }

    try {
      await this.accountRepository.save(newAccount);
    } catch (e) {
      this.eventBus.publish(
        new PostgresAccountHasNotBeenCreatedEvent(newAccount.id),
      );
    }
  }
}
