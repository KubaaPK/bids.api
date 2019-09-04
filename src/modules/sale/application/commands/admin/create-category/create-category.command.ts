import { NewCategoryDto } from '../../../dtos/write/category/new-category.dto';

export class CreateCategoryCommand {
  constructor(public readonly newCategory: NewCategoryDto) {}
}
