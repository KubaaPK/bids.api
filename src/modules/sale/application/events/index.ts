import { Type } from '@nestjs/common';
import { AccountCreatedEventHandler } from './account-created/account-created.handler';
import { PurchaseMadeHandler } from './purchase-made/purchase-made.handler';

export const eventHandlers: Type<any>[] = [
  AccountCreatedEventHandler,
  PurchaseMadeHandler,
];
