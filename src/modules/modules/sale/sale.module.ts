import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { commandHandlers } from './application/commands';
import { CategoryController } from './application/controllers/category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './domain/category/category';
import { ioCContainer } from '../../../config/ioc-container';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Category])],
  providers: [...ioCContainer, ...commandHandlers],
  controllers: [CategoryController],
})
export class SaleModule {}
