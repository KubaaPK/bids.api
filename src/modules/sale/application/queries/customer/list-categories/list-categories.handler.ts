import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListCategoriesQuery } from './list-categories.query';
import { CategoryRepository } from '../../../../domain/category/category.repository';
import { Category } from '../../../../domain/category/category';
import { plainToClass } from 'class-transformer';
import { ListableCategoryDto } from '../../../dtos/read/listable-category.dto';

@QueryHandler(ListCategoriesQuery)
export class ListCategoriesHandler
  implements IQueryHandler<ListCategoriesQuery> {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  public async execute(query: ListCategoriesQuery): Promise<any> {
    const categories: Category[] = await this.categoryRepository.find();

    return categories.map((category: Category) => {
      return plainToClass(ListableCategoryDto, category);
    });
  }
}
