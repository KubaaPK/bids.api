import { Type } from '@nestjs/common';
import { CreateCategoryHandler } from './admin/create-category/create-category.handler';

export const commandHandlers: Type<any>[] = [CreateCategoryHandler];
