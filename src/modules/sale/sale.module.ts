import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { commandHandlers } from './application/commands';
import { CategoryController } from './application/controllers/category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './domain/category/category';
import { ioCContainer } from '../../config/ioc-container';
import { queryHandlers } from './application/queries';
import { ParameterController } from './application/controllers/parameter.controller';
import { DeliveryMethodController } from './application/controllers/delivery-method.controller';
import { ShippingRate } from './domain/customer/shipping-rate/shipping-rate';
import { ShippingRateController } from './application/controllers/shipping-rate.controller';
import { eventHandlers } from './application/events';
import { OfferController } from './application/controllers/offer.controller';
import { ParameterValidator } from './application/services/parameter-validator/parameter-validator';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Category, ShippingRate])],
  providers: [
    ...ioCContainer,
    ...commandHandlers,
    ...queryHandlers,
    ...eventHandlers,
    ParameterValidator,
  ],
  controllers: [
    CategoryController,
    ParameterController,
    DeliveryMethodController,
    ShippingRateController,
    OfferController,
  ],
})
export class SaleModule {}
