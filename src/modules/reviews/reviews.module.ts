import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ioCContainer } from '../../config/ioc-container';
import { commandHandlers } from './application/commands';
import { ReviewController } from './application/controllers/review.controller';

@Module({
  imports: [CqrsModule],
  providers: [...ioCContainer, ...commandHandlers],
  controllers: [ReviewController],
})
export class ReviewsModule {}
