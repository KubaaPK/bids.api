import { Module } from '@nestjs/common';
import { ioCContainer } from '../../config/ioc-container';
import { FeeController } from './application/controllers/fee.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { commandHandlers } from './application/commands';
import { queryHandlers } from './application/queries';

@Module({
  imports: [CqrsModule],
  providers: [...ioCContainer, ...commandHandlers, ...queryHandlers],
  controllers: [FeeController],
})
export class PricingModule {}
