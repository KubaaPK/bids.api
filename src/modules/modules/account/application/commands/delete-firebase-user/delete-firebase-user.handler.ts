import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DeleteFirebaseUserCommand } from './delete-firebase-user.command';
import * as admin from 'firebase-admin';
import { FirebaseUserHasNotBeenDeletedEvent } from '../../events/firebase-user-has-not-been-deleted/firebase-user-has-not-been-deleted.event';

@CommandHandler(DeleteFirebaseUserCommand)
export class DeleteFirebaseUserHandler
  implements ICommandHandler<DeleteFirebaseUserCommand> {
  constructor(private readonly eventBus: EventBus) {}

  public async execute(command: DeleteFirebaseUserCommand): Promise<void> {
    try {
      await admin.auth().deleteUser(command.accountId as string);
    } catch (e) {
      this.eventBus.publish(new FirebaseUserHasNotBeenDeletedEvent());
    }
  }
}
