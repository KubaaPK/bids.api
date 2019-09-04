import { Type } from '@nestjs/common';
import { CreateAccountHandler } from './create-account/create-account.handler';

export const commandHandlers: Type<any>[] = [CreateAccountHandler];
