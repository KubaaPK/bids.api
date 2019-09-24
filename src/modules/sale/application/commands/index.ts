import { Type } from '@nestjs/common';
import { CreateCategoryHandler } from './admin/create-category/create-category.handler';
import { DeleteCategoryHandler } from './admin/delete-category/delete-category.handler';
import { UpdateCategoryHandler } from './admin/update-category/update-category.handler';
import { CreateParameterHandler } from './admin/create-parameter/create-parameter.handler';
import { DeleteParameterHandler } from './admin/delete-parameter/delete-parameter.handler';
import { UpdateParameterHandler } from './admin/update-parameter/update-parameter.handler';
import { LinkParameterToCategoryHandler } from './admin/link-parameter-to-category/link-parameter-to-category.handler';
import { CreateDeliveryMethodHandler } from './admin/create-delivery-method/create-delivery-method.handler';
import { DeleteDeliveryMethodHandler } from './admin/delete-delivery-method/delete-delivery-method.handler';
import { UpdateDeliveryMethodHandler } from './admin/update-delivery-method/update-delivery-method.handler';
import { CreateShippingRateHandler } from './customer/create-shipping-rate/create-shipping-rate.handler';
import { DeleteShippingRateHandler } from './customer/delete-shipping-rate/delete-shipping-rate.handler';
import { UpdateShippingRateHandler } from './customer/update-shipping-rate/update-shipping-rate.handler';
import { CreateDraftOfferHandler } from './customer/create-draft-offer/create-draft-offer.handler';
import { UpdateDraftOfferHandler } from './customer/update-draft-offer/update-draft-offer.handler';
import { DeleteDraftOfferHandler } from './customer/delete-draft-offer/delete-draft-offer.handler';
import { RequestOfferPublicationHandler } from './customer/request-offer-publication/request-offer-publication.handler';
import { MakePurchaseHandler } from './customer/make-purchase/make-purchase.handler';
import { UpdateOfferProductStockHandler } from './customer/update-offer-product-stock/update-offer-product-stock.handler';

export const commandHandlers: Type<any>[] = [
  CreateCategoryHandler,
  DeleteCategoryHandler,
  UpdateCategoryHandler,
  CreateParameterHandler,
  DeleteParameterHandler,
  UpdateParameterHandler,
  LinkParameterToCategoryHandler,
  CreateDeliveryMethodHandler,
  DeleteDeliveryMethodHandler,
  UpdateDeliveryMethodHandler,
  CreateShippingRateHandler,
  DeleteShippingRateHandler,
  UpdateShippingRateHandler,
  CreateDraftOfferHandler,
  UpdateDraftOfferHandler,
  DeleteDraftOfferHandler,
  RequestOfferPublicationHandler,
  MakePurchaseHandler,
  UpdateOfferProductStockHandler,
];
