import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LinkParameterToCategoryCommand } from './link-parameter-to-category.command';
import { CategoryRepository } from '../../../../domain/category/category.repository';
import { ParameterRepository } from '../../../../domain/category/parameter.repository';
import { Uuid } from '../../../../../common/uuid';
import { InvalidUuidFormatException } from '../../../../../common/exceptions/invalid-uuid-format.exception';
import { Category } from '../../../../domain/category/category';
import { CategoryNotFoundException } from '../../../../domain/category/exceptions/category-not-found.exception';
import { Parameter } from '../../../../domain/category/parameter';
import { ParameterNotFoundException } from '../../../../domain/category/exceptions/parameter-not-found.exception';

@CommandHandler(LinkParameterToCategoryCommand)
export class LinkParameterToCategoryHandler
  implements ICommandHandler<LinkParameterToCategoryCommand> {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly parameterRepository: ParameterRepository,
  ) {}

  public async execute(command: LinkParameterToCategoryCommand): Promise<any> {
    if (
      !Uuid.isUuidV4(command.categoryId) ||
      !Uuid.isUuidV4(command.parameterId)
    ) {
      throw new InvalidUuidFormatException();
    }

    const category: Category = await this.categoryRepository.findOne(
      command.categoryId,
    );
    if (!category) {
      throw new CategoryNotFoundException();
    }

    const parameter: Parameter = await this.parameterRepository.findOne(
      command.parameterId,
    );
    if (!parameter) {
      throw new ParameterNotFoundException();
    }

    await category.linkParameter(parameter);
    await this.categoryRepository.save(category);
  }
}
