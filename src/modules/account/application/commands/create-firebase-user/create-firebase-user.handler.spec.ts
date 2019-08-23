import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateFirebaseUserHandler } from './create-firebase-user.handler';
import { AccountRepository } from '../../../domain/account.repository';
import { ioCContainer } from '../../../../../config/ioc-container';
import { EntityManager } from 'typeorm';
import { NewAccountDto } from '../../dtos/write/new-account.dto';
import { CreateFirebaseUserCommand } from './create-firebase-user.command';
import { EventBus } from '@nestjs/cqrs';
import { AccountType } from '../../../domain/account-type.enum';
import SpyInstance = jest.SpyInstance;

const firebaseAdminFlags = {
  createUser: {
    error: false,
    userExists: false,
  },
  setCustomUserClaims: {
    error: false,
  },
};

jest.mock('firebase-admin', () => {
  return {
    auth: jest.fn().mockReturnThis(),
    createUser: jest.fn((credentials: any) => {
      if (firebaseAdminFlags.createUser.error) {
        throw new Error();
      }
      if (firebaseAdminFlags.createUser.userExists) {
        throw {
          code: 'auth/email-already-exists',
        };
      }
      return '82300f58-f755-44aa-b46d-f17d8c07d076';
    }),
    setCustomUserClaims: jest.fn(() => {
      if (firebaseAdminFlags.setCustomUserClaims.error) {
        throw new Error();
      }
      return undefined;
    }),
  };
});

describe('Create Firebase User Handler', () => {
  let handler: CreateFirebaseUserHandler;
  let accountRepository: AccountRepository;
  let eventBus: EventBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ...ioCContainer,
        CreateFirebaseUserHandler,
        {
          provide: EntityManager,
          useValue: {
            getRepository: jest.fn().mockReturnThis(),
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

    handler = module.get(CreateFirebaseUserHandler);
    accountRepository = module.get(AccountRepository);
    eventBus = module.get(EventBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should Create Firebase User Handler be defined', async () => {
    expect(handler).toBeDefined();
  });

  it('should Account Repository be defined', async () => {
    expect(accountRepository).toBeDefined();
  });

  it('should throw Bad Request Exception if NIP number is not valid', async () => {
    const newUser: NewAccountDto = {
      email: 'johndoe22@gmail.com',
      id: 'dce7b557-025a-4273-b43f-963fc83a1a6b',
      password: 'super-secret-password',
      username: 'johndoe22',
      type: AccountType.COMPANY,
      nip: 1111111112,
    };

    await expect(
      handler.execute(new CreateFirebaseUserCommand(newUser)),
    ).rejects.toThrowError(BadRequestException);
  });

  it('should throw Internal Server Error Exception if creating Firebase user fails', async () => {
    firebaseAdminFlags.createUser.error = true;

    const newUser: NewAccountDto = {
      email: 'johndoe22@gmail.com',
      id: 'dce7b557-025a-4273-b43f-963fc83a1a6b',
      password: 'super-secret-password',
      username: 'johndoe22',
      type: AccountType.PRIVATE,
    };

    await expect(
      handler.execute(new CreateFirebaseUserCommand(newUser)),
    ).rejects.toThrowError(InternalServerErrorException);

    firebaseAdminFlags.createUser.error = false;
  });

  it('should throw Conflict Exception if user with given email already exists in Firebase', async () => {
    firebaseAdminFlags.createUser.userExists = true;

    const newUser: NewAccountDto = {
      email: 'johndoe22@gmail.com',
      id: 'dce7b557-025a-4273-b43f-963fc83a1a6b',
      password: 'super-secret-password',
      username: 'johndoe22',
      type: AccountType.PRIVATE,
    };

    await expect(
      handler.execute(new CreateFirebaseUserCommand(newUser)),
    ).rejects.toThrowError(ConflictException);

    firebaseAdminFlags.createUser.userExists = false;
  });

  it('should call Firebase User Created Event if Firebase user has been created', async () => {
    const eventBusSpy: SpyInstance = jest.spyOn(eventBus, 'publish');
    const newUser: NewAccountDto = {
      email: 'johndoe22@gmail.com',
      id: 'dce7b557-025a-4273-b43f-963fc83a1a6b',
      password: 'super-secret-password',
      username: 'johndoe22',
      type: AccountType.PRIVATE,
    };

    await handler.execute(new CreateFirebaseUserCommand(newUser));

    expect(eventBusSpy).toBeCalledWith({ newAccount: newUser });
  });
});
