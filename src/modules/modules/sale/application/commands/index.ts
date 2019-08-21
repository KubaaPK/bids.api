import { Type } from '@nestjs/common';
import { CreateCategoryHandler } from './admin/create-category/create-category.handler';
import { DeleteCategoryHandler } from './admin/delete-category/delete-category.handler';

export const commandHandlers: Type<any>[] = [
  CreateCategoryHandler,
  DeleteCategoryHandler,
];
