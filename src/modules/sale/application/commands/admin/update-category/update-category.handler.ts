import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCategoryCommand } from './update-category.command';
import { CategoryRepository } from '../../../../domain/category/category.repository';
import { Category } from '../../../../domain/category/category';
import { CategoryNotFoundException } from '../../../../domain/category/exceptions/category-not-found.exception';
import { InvalidUuidFormatException } from '../../../../../common/exceptions/invalid-uuid-format.exception';
import { Uuid } from '../../../../../common/uuid';

@CommandHandler(UpdateCategoryCommand)
export class UpdateCategoryHandler
  implements ICommandHandler<UpdateCategoryCommand> {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  public async execute(command: UpdateCategoryCommand): Promise<any> {
    if (!Uuid.isUuidV4(command.id)) {
      throw new InvalidUuidFormatException();
    }

    const category: Category = await this.categoryRepository.findOne(
      command.id,
    );
    if (!category) {
      throw new CategoryNotFoundException();
    }

    category.update(command.updatedCategory);
    await this.categoryRepository.save(category);
  }
}
