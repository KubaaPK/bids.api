import { Test, TestingModule } from '@nestjs/testing';
import { DeleteFirebaseUserHandler } from './delete-firebase-user.handler';
import { DeleteFirebaseUserCommand } from './delete-firebase-user.command';
import { EventBus } from '@nestjs/cqrs';
import SpyInstance = jest.SpyInstance;
import { FirebaseUserHasNotBeenDeletedEvent } from '../../events/firebase-user-has-not-been-deleted/firebase-user-has-not-been-deleted.event';

const firebaseAdminFlags = {
  deleteUser: {
    error: false,
  },
};

jest.mock('firebase-admin', () => {
  return {
    auth: jest.fn().mockReturnThis(),
    deleteUser: jest.fn(() => {
      if (firebaseAdminFlags.deleteUser.error) {
        throw new Error();
      }
    }),
  };
});

describe('Delete Firebase User Handler', () => {
  let handler: DeleteFirebaseUserHandler;
  let eventBus: EventBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteFirebaseUserHandler,
        {
          provide: EventBus,
          useValue: {
            publish: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get(DeleteFirebaseUserHandler);
    eventBus = module.get(EventBus);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should Delete Firebase User Handler be defined', async () => {
    expect(handler).toBeDefined();
  });

  it('should throw call Firebase User Has Not Been Deleted if delete user from Firebase fails ', async () => {
    firebaseAdminFlags.deleteUser.error = true;
    const eventBusSpy: SpyInstance = jest.spyOn(eventBus, 'publish');

    await handler.execute(new DeleteFirebaseUserCommand('account-id'));

    expect(eventBusSpy).toBeCalledWith(
      new FirebaseUserHasNotBeenDeletedEvent(),
    );
  });
});
