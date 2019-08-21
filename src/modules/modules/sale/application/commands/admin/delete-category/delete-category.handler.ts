import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteCategoryCommand } from './delete-category.command';
import { CategoryRepository } from '../../../../domain/category/category.repository';
import { Uuid } from '../../../../../../common/uuid';
import { InvalidUuidFormatException } from '../../../../../../common/exceptions/invalid-uuid-format.exception';
import { Category } from '../../../../domain/category/category';
import { CategoryNotFoundException } from '../../../../domain/category/exceptions/category-not-found.exception';

@CommandHandler(DeleteCategoryCommand)
export class DeleteCategoryHandler
  implements ICommandHandler<DeleteCategoryCommand> {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  public async execute(command: DeleteCategoryCommand): Promise<any> {
    if (!Uuid.isUuidV4(command.id)) {
      throw new InvalidUuidFormatException();
    }

    const category: Category = await this.categoryRepository.findOne(
      command.id,
    );
    if (!category) {
      throw new CategoryNotFoundException();
    }
    await this.categoryRepository.delete(command.id);
  }
}
