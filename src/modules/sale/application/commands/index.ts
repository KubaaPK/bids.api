import { Type } from '@nestjs/common';
import { CreateCategoryHandler } from './admin/create-category/create-category.handler';
import { DeleteCategoryHandler } from './admin/delete-category/delete-category.handler';
import { UpdateCategoryHandler } from './admin/update-category/update-category.handler';
import { CreateParameterHandler } from './admin/create-parameter/create-parameter.handler';
import { DeleteParameterHandler } from './admin/delete-parameter/delete-parameter.handler';
import { UpdateParameterHandler } from './admin/update-parameter/update-parameter.handler';
import { LinkParameterToCategoryHandler } from './admin/link-parameter-to-category/link-parameter-to-category.handler';
import { CreateDeliveryMethodHandler } from './admin/create-delivery-method/create-delivery-method.handler';

export const commandHandlers: Type<any>[] = [
  CreateCategoryHandler,
  DeleteCategoryHandler,
  UpdateCategoryHandler,
  CreateParameterHandler,
  DeleteParameterHandler,
  UpdateParameterHandler,
  LinkParameterToCategoryHandler,
  CreateDeliveryMethodHandler,
];
