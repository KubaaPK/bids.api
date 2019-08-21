import { Type } from '@nestjs/common';
import { ListCategoriesHandler } from './list-categories/list-categories.handler';
import { ListCategoryHandler } from './list-category/list-category.handler';

export const queryHandlers: Type<any>[] = [
  ListCategoriesHandler,
  ListCategoryHandler,
];
