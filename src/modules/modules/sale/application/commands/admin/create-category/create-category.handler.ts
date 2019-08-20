import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InternalServerErrorException } from '@nestjs/common';
import { CreateCategoryCommand } from './create-category.command';
import { CategoryRepository } from '../../../../domain/category/category.repository';
import { Category } from '../../../../domain/category/category';
import { CategoryAlreadyExistsException } from '../../../../domain/category/exceptions/category-already-exists.exception';
import { ExceptionMessages } from '../../../../../../common/exception-messages';
import { ParentCategoryNotFoundException } from '../../../../domain/category/exceptions/parent-category-not-found.exception';

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryHandler
  implements ICommandHandler<CreateCategoryCommand> {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  public async execute(command: CreateCategoryCommand): Promise<void> {
    const category: Category = await this.categoryRepository.findOne(
      command.newCategory.name,
    );
    if (category) {
      throw new CategoryAlreadyExistsException();
    }
    if (command.newCategory.parent) {
      const parentCategory: Category = await this.categoryRepository.findOne(
        command.newCategory.parent.id,
      );
      if (!parentCategory) {
        throw new ParentCategoryNotFoundException();
      }
      parentCategory.leaf = false;
      await this.categoryRepository.save(parentCategory);
    }

    try {
      const newCategory: Category = Category.create(command.newCategory);
      await this.categoryRepository.save(newCategory);
    } catch (e) {
      throw new InternalServerErrorException(
        ExceptionMessages.GENERIC_INTERNAL_SERVER_ERROR,
      );
    }
  }
}
