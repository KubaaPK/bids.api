import { Type } from '@nestjs/common';
import { CreateFirebaseUserHandler } from './create-firebase-user/create-firebase-user.handler';
import { CreatePostgresAccountHandler } from './create-postgres-account/create-postgres-account.handler';
import { DeleteFirebaseUserHandler } from './delete-firebase-user/delete-firebase-user.handler';

export const commandHandlers: Type<any>[] = [
  CreateFirebaseUserHandler,
  CreatePostgresAccountHandler,
  DeleteFirebaseUserHandler,
];
