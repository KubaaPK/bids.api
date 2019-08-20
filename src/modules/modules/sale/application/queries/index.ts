import { Type } from '@nestjs/common';
import { ListCategoriesHandler } from './list-categories/list-categories.handler';

export const queryHandlers: Type<any>[] = [ListCategoriesHandler];
