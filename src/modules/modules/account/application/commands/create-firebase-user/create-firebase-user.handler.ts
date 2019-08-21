import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateFirebaseUserCommand } from './create-firebase-user.command';
import * as admin from 'firebase-admin';
import { AccountRole } from '../../../domain/account-role.enum';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { FirebaseUserCreatedEvent } from '../../events/firebase-user-created/firebase-user-created.event';
import { ExceptionMessages } from '../../../../../common/exception-messages';
import { AccountType } from '../../../domain/account-type.enum';
import UserRecord = admin.auth.UserRecord;

@CommandHandler(CreateFirebaseUserCommand)
export class CreateFirebaseUserHandler
  implements ICommandHandler<CreateFirebaseUserCommand> {
  constructor(private readonly eventBus: EventBus) {}

  public async execute(command: CreateFirebaseUserCommand): Promise<void> {
    if (command.newAccount.type === AccountType.COMPANY) {
      if (!this.isNipValid(command.newAccount.nip)) {
        throw new BadRequestException('Niepoprawny numer NIP.');
      }
    }

    try {
      const userRecord: UserRecord = await admin
        .auth()
        .createUser(command.newAccount);

      admin.auth().setCustomUserClaims(userRecord.uid, {
        roles: [AccountRole.USER],
      });

      this.eventBus.publish(new FirebaseUserCreatedEvent(command.newAccount));
    } catch (e) {
      if (e.code === 'auth/email-already-exists') {
        throw new ConflictException('Konto o podanych danych już istnieje.');
      }
      throw new InternalServerErrorException(
        ExceptionMessages.GENERIC_INTERNAL_SERVER_ERROR,
      );
    }
  }

  private isNipValid(nip: number): boolean {
    const weight: number[] = [6, 5, 7, 2, 3, 4, 5, 6, 7];
    let sum: number = 0;
    const controlNumber: number = parseInt(nip.toString().substring(9, 10), 10);
    for (let i = 0; i < weight.length; i++) {
      sum += parseInt(nip.toString().substring(i, i + 1), 10) * weight[i];
    }
    return sum % 11 === controlNumber;
  }
}
