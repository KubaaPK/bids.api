import { Type } from '@nestjs/common';
import { ListCategoriesHandler } from './customer/list-categories/list-categories.handler';
import { ListCategoryHandler } from './customer/list-category/list-category.handler';
import { ListParametersHandler } from './admin/list-parameters/list-parameters.handler';
import { ListCategoryParametersHandler } from './customer/list-category-parameters/list-category-parameters.handler';
import { ListDeliveryMethodsHandler } from './customer/list-delivery-methods/list-delivery-methods.handler';
import { ListShippingRatesHandler } from './customer/list-shipping-rates/list-shipping-rates.handler';

export const queryHandlers: Type<any>[] = [
  ListCategoriesHandler,
  ListCategoryHandler,
  ListParametersHandler,
  ListCategoryParametersHandler,
  ListDeliveryMethodsHandler,
  ListShippingRatesHandler,
];
