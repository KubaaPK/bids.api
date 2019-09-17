import { Module } from '@nestjs/common';
import { ioCContainer } from '../../config/ioc-container';
import { FeeController } from './application/controllers/fee.controller';

@Module({
  providers: [...ioCContainer],
  controllers: [FeeController],
})
export class PricingModule {}
