import { Type } from '@nestjs/common';
import { FirebaseUserCreatedHandler } from './firebase-user-created/firebase-user-created.handler';
import { PostgresAccountHasNotBeenCreatedHandler } from './postgres-account-has-not-been-created/postgres-account-has-not-been-created.handler';

export const eventHandlers: Type<any>[] = [
  FirebaseUserCreatedHandler,
  PostgresAccountHasNotBeenCreatedHandler,
];
