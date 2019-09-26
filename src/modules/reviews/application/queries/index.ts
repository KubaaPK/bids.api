import { Type } from '@nestjs/common';
import { ListPurchasesToEvaluateHandler } from './list-purchases-to-evaluate/list-purchases-to-evaluate.handler';

export const queryHandlers: Type<any>[] = [ListPurchasesToEvaluateHandler];
