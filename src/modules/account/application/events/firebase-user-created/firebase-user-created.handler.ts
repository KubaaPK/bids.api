import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { FirebaseUserCreatedEvent } from './firebase-user-created.event';
import { CreatePostgresAccountCommand } from '../../commands/create-postgres-account/create-postgres-account.command';

@EventsHandler(FirebaseUserCreatedEvent)
export class FirebaseUserCreatedHandler
  implements IEventHandler<FirebaseUserCreatedEvent> {
  constructor(private readonly commandBus: CommandBus) {}

  public async handle(event: FirebaseUserCreatedEvent): Promise<void> {
    await this.commandBus.execute(
      new CreatePostgresAccountCommand(event.newAccount),
    );
  }
}
