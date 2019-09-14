import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Category } from '../../../domain/category/category';
import { CategoryNotFoundException } from '../../../domain/category/exceptions/category-not-found.exception';
import { ParameterValueDto } from '../../dtos/write/offer/parameter-value.dto';

@Injectable()
export class CategoryValidator {
  public async checkCategoryCorrectness(category: Category): Promise<void> {
    if (!category) {
      throw new CategoryNotFoundException();
    }
    if (!category.leaf) {
      throw new UnprocessableEntityException(
        'Wybrana kategoria posiada podkategorie i nie można dodawać do niej ofert.',
      );
    }
  }

  public async checkIfCategoryHasGivenParameters(
    category: Category,
    parameters: ParameterValueDto[],
  ): Promise<void> {
    if (parameters) {
      if (!(await category.hasParameters(parameters.map(el => el.id)))) {
        throw new UnprocessableEntityException(
          'Wybrana kategoria nie posiada przekazanych parametrów.',
        );
      }
    }
  }
}
