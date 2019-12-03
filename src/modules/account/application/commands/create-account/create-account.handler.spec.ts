import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';
import * as faker from 'faker';
import { CreateAccountHandler } from './create-account.handler';
import { AccountRepository } from '../../../domain/account.repository';
import * as admin from 'firebase-admin';
import { NewAccountDto } from '../../dtos/write/new-account.dto';
import { CreateAccountCommand } from './create-account.command';
import { InternalServerErrorException } from '@nestjs/common';
import { AccountAlreadyExistsException } from '../../../domain/exceptions/account-already-exists.exception';
import { Account } from '../../../domain/account';
import { EventBus } from '@nestjs/cqrs';
import { Uuid } from '../../../../common/uuid';
import { AccountType } from '../../../domain/account-type.enum';
import UserRecord = admin.auth.UserRecord;
import { AccountCreatedEvent } from '../../events/account-created/account-created.event';
import { PostgresAccountRepository } from '../../../infrastructure/repositories/postgres.account.repository';

const firebaseFlags = {
  createUser: {
    error: false,
    userExists: false,
  },
  deleteUser: {
    error: false,
  },
};

const firebaseCreatedUserId: string = 'f9c71c63-40a8-448f-92aa-4d98fd74332c';

jest.mock('firebase-admin', () => {
  return {
    auth: jest.fn().mockReturnThis(),
    setCustomUserClaims: jest.fn(),
    createUser: jest.fn(() => {
      if (firebaseFlags.createUser.error) {
        throw new Error();
      }
      if (firebaseFlags.createUser.userExists) {
        throw {
          code: 'auth/email-already-exists',
        };
      }
      return {
        uid: firebaseCreatedUserId,
      } as UserRecord;
    }),

    deleteUser: jest.fn(() => {
      if (firebaseFlags.deleteUser.error) {
        throw new Error();
      }
    }),
  };
});

describe('Create Account Handler', () => {
  let handler: CreateAccountHandler;
  let accountRepository: AccountRepository;
  let eventBus: EventBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateAccountHandler,
        {
          provide: AccountRepository,
          useClass: PostgresAccountRepository,
        },
        {
          provide: EntityManager,
          useValue: {
            getRepository: jest.fn().mockReturnThis(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: EventBus,
          useValue: {
            publish: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get(CreateAccountHandler);
    accountRepository = module.get(AccountRepository);
    eventBus = module.get(EventBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
    firebaseFlags.createUser.error = false;
    firebaseFlags.createUser.userExists = false;
    firebaseFlags.deleteUser.error = false;
  });

  it('should Create Account Handler be defined', async () => {
    expect(handler).toBeDefined();
  });

  it('should Account Repository be defined', async () => {
    expect(accountRepository).toBeDefined();
  });

  it('should Event Bus be defined', async () => {
    expect(eventBus).toBeDefined();
  });

  it('should throw Internal Server Error Exception if creating Firebase user fails', async () => {
    firebaseFlags.createUser.error = true;

    const newAccount: NewAccountDto = {
      email: faker.internet.email(),
      id: (firebaseCreatedUserId as any) as Uuid,
      password: faker.internet.password(),
      username: faker.internet.userName(),
      type: AccountType.PRIVATE,
    };

    await expect(
      handler.execute(new CreateAccountCommand(newAccount)),
    ).rejects.toThrowError(InternalServerErrorException);
  });

  it('should throw Account Already Exists exception if Firebase user with given email already exists', async () => {
    firebaseFlags.createUser.userExists = true;

    const newAccount: NewAccountDto = {
      email: faker.internet.email(),
      id: (firebaseCreatedUserId as any) as Uuid,
      password: faker.internet.password(),
      username: faker.internet.userName(),
      type: AccountType.PRIVATE,
    };

    await expect(
      handler.execute(new CreateAccountCommand(newAccount)),
    ).rejects.toThrowError(AccountAlreadyExistsException);
  });

  it('should throw Internal Server Error Exception if selecting account from Postgres fails', async () => {
    jest.spyOn(accountRepository, 'findOne').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    const newAccount: NewAccountDto = {
      email: faker.internet.email(),
      id: (firebaseCreatedUserId as any) as Uuid,
      password: faker.internet.password(),
      username: faker.internet.userName(),
      type: AccountType.PRIVATE,
    };

    await expect(
      handler.execute(new CreateAccountCommand(newAccount)),
    ).rejects.toThrowError(InternalServerErrorException);
  });

  it('should call Account Repository save() method with proper parameters', async () => {
    jest
      .spyOn(accountRepository, 'findOne')
      .mockImplementationOnce(() => undefined);
    jest
      .spyOn(accountRepository, 'save')
      .mockImplementationOnce(async () => new Account());
    const accountRepositorySaveSpy: jest.SpyInstance = jest.spyOn(
      accountRepository,
      'save',
    );

    const newAccount: NewAccountDto = {
      email: faker.internet.email(),
      id: (firebaseCreatedUserId as any) as Uuid,
      password: faker.internet.password(),
      username: faker.internet.userName(),
      type: AccountType.PRIVATE,
    };

    await handler.execute(new CreateAccountCommand(newAccount));

    expect(accountRepositorySaveSpy).toBeCalledWith(Account.create(newAccount));
  });

  it('should throw Account Already Exists if account with given username already exists in Postgres', async () => {
    jest
      .spyOn(accountRepository, 'findOne')
      .mockImplementationOnce(async () => new Account());

    const newAccount: NewAccountDto = {
      email: faker.internet.email(),
      id: (firebaseCreatedUserId as any) as Uuid,
      password: faker.internet.password(),
      username: faker.internet.userName(),
      type: AccountType.PRIVATE,
    };

    await expect(
      handler.execute(new CreateAccountCommand(newAccount)),
    ).rejects.toThrowError(AccountAlreadyExistsException);
  });

  it('should throw Internal Server Error Exception if saving account to Postgres fails', async () => {
    jest.spyOn(accountRepository, 'save').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    const newAccount: NewAccountDto = {
      email: faker.internet.email(),
      id: (firebaseCreatedUserId as any) as Uuid,
      password: faker.internet.password(),
      username: faker.internet.userName(),
      type: AccountType.PRIVATE,
    };

    await expect(
      handler.execute(new CreateAccountCommand(newAccount)),
    ).rejects.toThrowError(InternalServerErrorException);
  });

  it('should raise Account Created Event if account has been created successfully', async () => {
    const dateSpy: jest.SpyInstance = jest.spyOn(global, 'Date');
    dateSpy.mockImplementationOnce(() => '2019-09-01T07:30:11.967Z');
    jest
      .spyOn(accountRepository, 'findOne')
      .mockImplementationOnce(() => undefined);
    jest
      .spyOn(accountRepository, 'save')
      .mockImplementationOnce(async () => new Account());
    const eventBusPublishSpy: jest.SpyInstance = jest.spyOn(
      eventBus,
      'publish',
    );

    const username = faker.internet.userName();
    const newAccount: NewAccountDto = {
      username,
      email: faker.internet.email(),
      id: (firebaseCreatedUserId as any) as Uuid,
      password: faker.internet.password(),
      type: AccountType.PRIVATE,
    };

    await handler.execute(new CreateAccountCommand(newAccount));

    expect(eventBusPublishSpy).toBeCalledWith(
      new AccountCreatedEvent(
        (firebaseCreatedUserId as any) as Uuid,
        username,
        new Date('2019-09-01T07:30:11.967Z'),
      ),
    );
  });
});
