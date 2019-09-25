import { Type } from '@nestjs/common';
import { ListFeesHandler } from './list-fees/list-fees.handler';

export const queryHandlers: Type<any>[] = [ListFeesHandler];
