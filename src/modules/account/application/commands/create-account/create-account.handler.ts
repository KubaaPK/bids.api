import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import * as admin from 'firebase-admin';
import { CreateAccountCommand } from './create-account.command';
import { AccountRepository } from '../../../domain/account.repository';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { Account } from '../../../domain/account';
import { NewAccountDto } from '../../dtos/write/new-account.dto';
import { AccountRole } from '../../../domain/account-role.enum';
import { AccountCreatedEvent } from '../../events/account-created/account-created.event';
import { Uuid } from '../../../../common/uuid';
import { ExceptionMessages } from '../../../../common/exception-messages';
import { AccountAlreadyExistsException } from '../../../domain/exceptions/account-already-exists.exception';

@CommandHandler(CreateAccountCommand)
export class CreateAccountHandler
  implements ICommandHandler<CreateAccountCommand> {
  private readonly logger: Logger = new Logger(CreateAccountHandler.name, true);

  public constructor(
    private readonly accountRepository: AccountRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async execute(command: CreateAccountCommand): Promise<void> {
    const { newAccount } = command;
    const createdFirebaseUser: admin.auth.UserRecord = await this.createFirebaseUser(
      newAccount,
    );

    if (await this.accountExistsInPostgres(newAccount.username)) {
      await this.deleteFirebaseUser(createdFirebaseUser.uid);
      throw new AccountAlreadyExistsException();
    }

    const account: Account = Account.create(newAccount);
    await this.accountRepository.save(account);
    await this.eventBus.publish(
      new AccountCreatedEvent(
        (createdFirebaseUser.uid as any) as Uuid,
        new Date(),
      ),
    );
  }

  private async accountExistsInPostgres(username: string): Promise<boolean> {
    try {
      return (await this.accountRepository.findOne(username)) !== undefined;
    } catch (e) {
      this.logger.error(e.message);
      throw new InternalServerErrorException(
        ExceptionMessages.GENERIC_INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async createFirebaseUser(
    newAccount: NewAccountDto,
  ): Promise<admin.auth.UserRecord> {
    try {
      const createdFirebaseUser: admin.auth.UserRecord = await admin
        .auth()
        .createUser({
          uid: newAccount.id.toString(),
          email: newAccount.email,
          password: newAccount.password,
        });

      await admin.auth().setCustomUserClaims(createdFirebaseUser.uid, {
        roles: [AccountRole.USER],
      });

      return createdFirebaseUser;
    } catch (e) {
      if (e.code === 'auth/email-already-exists') {
        throw new AccountAlreadyExistsException();
      } else {
        this.logger.error(e.message);
        throw new InternalServerErrorException(
          ExceptionMessages.GENERIC_INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  private async deleteFirebaseUser(uid: string): Promise<void> {
    try {
      admin.auth().deleteUser(uid);
    } catch (e) {
      this.logger.error(e.message);
      throw new InternalServerErrorException(
        ExceptionMessages.GENERIC_INTERNAL_SERVER_ERROR,
      );
    }
  }
}
