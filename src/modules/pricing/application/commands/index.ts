import { Type } from '@nestjs/common';
import { ChargeFeeHandler } from './charge-fee/charge-fee.handler';

export const commandHandlers: Type<any>[] = [ChargeFeeHandler];
