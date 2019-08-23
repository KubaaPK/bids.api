import { Test, TestingModule } from '@nestjs/testing';
import { CreatePostgresAccountHandler } from './create-postgres-account.handler';
import { AccountRepository } from '../../../domain/account.repository';
import { ioCContainer } from '../../../../../config/ioc-container';
import { InternalServerErrorException } from '@nestjs/common';
import { NewAccountDto } from '../../dtos/write/new-account.dto';
import { CreatePostgresAccountCommand } from './create-postgres-account.command';
import { AccountType } from '../../../domain/account-type.enum';
import { EventBus } from '@nestjs/cqrs';
// tslint:disable-next-line:max-line-length
import { PostgresAccountHasNotBeenCreatedEvent } from '../../events/postgres-account-has-not-been-created/postgres-account-has-not-been-created.event';
import { Account } from '../../../domain/account';
import { EntityManager } from 'typeorm';
import SpyInstance = jest.SpyInstance;

describe('Create Postgres Account Handler', () => {
  let handler: CreatePostgresAccountHandler;
  let accountRepository: AccountRepository;
  let eventBus: EventBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatePostgresAccountHandler,
        ...ioCContainer,
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

    handler = module.get(CreatePostgresAccountHandler);
    accountRepository = module.get(AccountRepository);
    eventBus = module.get(EventBus);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should Create Postgres Handler be defined', async () => {
    expect(handler).toBeDefined();
  });

  it('should Account Repository be defined', async () => {
    expect(accountRepository).toBeDefined();
  });

  it('should throw Internal Server Error Exception if selecting account from Postgres fails', async () => {
    jest.spyOn(accountRepository, 'findOne').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    const newAccount: NewAccountDto = {
      email: 'johndoe22@gmail.com',
      id: 'dce7b557-025a-4273-b43f-963fc83a1a6b',
      password: 'super-secret-password',
      type: AccountType.PRIVATE,
      username: 'johndoe22',
    };

    await expect(
      handler.execute(new CreatePostgresAccountCommand(newAccount)),
    ).rejects.toThrowError(InternalServerErrorException);
  });

  it('should call Postgres Account Has Not Been Created Event if account with given username already exists in Postgres', async () => {
    const eventBusSpy: SpyInstance = jest.spyOn(eventBus, 'publish');
    jest
      .spyOn(accountRepository, 'findOne')
      .mockImplementationOnce(async () => new Account());
    jest
      .spyOn(accountRepository, 'save')
      .mockImplementationOnce(() => undefined);

    const newAccount: NewAccountDto = {
      email: 'johndoe22@gmail.com',
      id: 'dce7b557-025a-4273-b43f-963fc83a1a6b',
      password: 'super-secret-password',
      type: AccountType.PRIVATE,
      username: 'johndoe22',
    };

    await handler.execute(new CreatePostgresAccountCommand(newAccount));

    expect(eventBusSpy).toBeCalledWith(
      new PostgresAccountHasNotBeenCreatedEvent(newAccount.id),
    );
  });

  it('should call Postgres Account Has Not Been Created Event if saving account to Postgres fails', async () => {
    const eventBusSpy: SpyInstance = jest.spyOn(eventBus, 'publish');
    jest
      .spyOn(accountRepository, 'findOne')
      .mockImplementationOnce(() => undefined);
    jest.spyOn(accountRepository, 'save').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    const newAccount: NewAccountDto = {
      email: 'johndoe22@gmail.com',
      id: 'dce7b557-025a-4273-b43f-963fc83a1a6b',
      password: 'super-secret-password',
      type: AccountType.PRIVATE,
      username: 'johndoe22',
    };

    await handler.execute(new CreatePostgresAccountCommand(newAccount));

    expect(eventBusSpy).toBeCalledWith(
      new PostgresAccountHasNotBeenCreatedEvent(newAccount.id),
    );
  });
});
