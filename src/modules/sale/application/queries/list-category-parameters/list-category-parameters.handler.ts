import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListCategoryParametersQuery } from './list-category-parameters.query';
import { CategoryRepository } from '../../../domain/category/category.repository';
import { Uuid } from '../../../../common/uuid';
import { InvalidUuidFormatException } from '../../../../common/exceptions/invalid-uuid-format.exception';
import { Category } from '../../../domain/category/category';
import { CategoryNotFoundException } from '../../../domain/category/exceptions/category-not-found.exception';
import { Parameter } from '../../../domain/category/parameter';
import { plainToClass } from 'class-transformer';
import { ListableParameterDto } from '../../dtos/read/listable-parameter.dto';

@QueryHandler(ListCategoryParametersQuery)
export class ListCategoryParametersHandler
  implements IQueryHandler<ListCategoryParametersQuery> {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  public async execute(
    query: ListCategoryParametersQuery,
  ): Promise<ListableParameterDto[]> {
    if (!Uuid.isUuidV4(query.categoryId)) {
      throw new InvalidUuidFormatException();
    }

    const category: Category = await this.categoryRepository.findOne(
      query.categoryId,
    );
    if (!category) {
      throw new CategoryNotFoundException();
    }

    return (await category.parameters).map((parameter: Parameter) => {
      return plainToClass(ListableParameterDto, parameter);
    });
  }
}
