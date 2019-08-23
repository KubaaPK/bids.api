import { NewCategoryDto } from '../../../dtos/write/new-category.dto';

export class CreateCategoryCommand {
  constructor(public readonly newCategory: NewCategoryDto) {}
}
