import { Type } from '@nestjs/common';
import { AccountCreatedEvent } from './account-created/account-created.event';

export const eventHandlers: Type<any>[] = [AccountCreatedEvent];
