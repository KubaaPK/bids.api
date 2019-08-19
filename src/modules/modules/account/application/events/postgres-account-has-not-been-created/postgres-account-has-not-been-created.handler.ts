import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PostgresAccountHasNotBeenCreatedEvent } from './postgres-account-has-not-been-created.event';
import { DeleteFirebaseUserCommand } from '../../commands/delete-firebase-user/delete-firebase-user.command';

@EventsHandler(PostgresAccountHasNotBeenCreatedEvent)
export class PostgresAccountHasNotBeenCreatedHandler
  implements IEventHandler<PostgresAccountHasNotBeenCreatedEvent> {
  constructor(private readonly commandBus: CommandBus) {}

  public async handle(
    event: PostgresAccountHasNotBeenCreatedEvent,
  ): Promise<void> {
    await this.commandBus.execute(
      new DeleteFirebaseUserCommand(event.accountId),
    );
  }
}
