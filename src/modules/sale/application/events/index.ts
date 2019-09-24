import { Type } from '@nestjs/common';
import { AccountCreatedEventHandler } from './account-created/account-created.handler';

export const eventHandlers: Type<any>[] = [AccountCreatedEventHandler];
