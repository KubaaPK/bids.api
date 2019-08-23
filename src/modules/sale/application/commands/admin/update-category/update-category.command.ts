import { Uuid } from '../../../../../common/uuid';
import { UpdatedCategoryDto } from '../../../dtos/write/updated-category.dto';

export class UpdateCategoryCommand {
  constructor(
    public readonly id: Uuid,
    public readonly updatedCategory: UpdatedCategoryDto,
  ) {}
}
