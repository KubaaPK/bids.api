import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListCategoryQuery } from './list-category.query';
import { ListableCategoryDto } from '../../dtos/read/listable-category.dto';
import { CategoryRepository } from '../../../domain/category/category.repository';
import { Category } from '../../../domain/category/category';
import { Uuid } from '../../../../common/uuid';
import { InvalidUuidFormatException } from '../../../../common/exceptions/invalid-uuid-format.exception';
import { CategoryNotFoundException } from '../../../domain/category/exceptions/category-not-found.exception';
import { plainToClass } from 'class-transformer';

@QueryHandler(ListCategoryQuery)
export class ListCategoryHandler implements IQueryHandler<ListCategoryQuery> {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  public async execute(query: ListCategoryQuery): Promise<ListableCategoryDto> {
    if (!Uuid.isUuidV4(query.id)) {
      throw new InvalidUuidFormatException();
    }

    const category: Category = await this.categoryRepository.findOne(query.id);
    if (!category) {
      throw new CategoryNotFoundException();
    }
    return plainToClass(ListableCategoryDto, category);
  }
}
