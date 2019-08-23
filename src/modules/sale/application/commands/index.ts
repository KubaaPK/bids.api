import { Type } from '@nestjs/common';
import { CreateCategoryHandler } from './admin/create-category/create-category.handler';
import { DeleteCategoryHandler } from './admin/delete-category/delete-category.handler';
import { UpdateCategoryHandler } from './admin/update-category/update-category.handler';
import { CreateParameterHandler } from './admin/create-parameter/create-parameter.handler';
import { DeleteParameterHandler } from './admin/delete-parameter/delete-parameter.handler';

export const commandHandlers: Type<any>[] = [
  CreateCategoryHandler,
  DeleteCategoryHandler,
  UpdateCategoryHandler,
  CreateParameterHandler,
  DeleteParameterHandler,
];
