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
import { CategoryValidator } from './application/services/category-validator/category-validator';
import { DraftOfferValidator } from './application/services/draft-offer-validator/draft-offer-validator';
import { AccountModule } from '../account/account.module';
import { AccountInformationService } from '../account/application/services/account-information/account-information.service';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([Category, ShippingRate]),
    AccountModule,
  ],
  providers: [
    ...ioCContainer,
    ...commandHandlers,
    ...queryHandlers,
    ...eventHandlers,
    ParameterValidator,
    CategoryValidator,
    DraftOfferValidator,
    AccountInformationService,
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
