import { Type } from '@nestjs/common';
import { ListCategoriesHandler } from './list-categories/list-categories.handler';
import { ListCategoryHandler } from './list-category/list-category.handler';
import { ListParametersHandler } from './admin/list-parameters/list-parameters.handler';

export const queryHandlers: Type<any>[] = [
  ListCategoriesHandler,
  ListCategoryHandler,
  ListParametersHandler,
];
