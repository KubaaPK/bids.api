import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateDraftOfferCommand } from './create-draft-offer.command';
import { CustomerRepository } from '../../../../domain/customer/customer.repository';
import { Customer } from '../../../../domain/customer/customer';
import { Offer } from '../../../../domain/offer/offer';
import { ParameterValidator } from '../../../services/parameter-validator/parameter-validator';
import { CategoryRepository } from '../../../../domain/category/category.repository';
import { Category } from '../../../../domain/category/category';
import { CategoryNotFoundException } from '../../../../domain/category/exceptions/category-not-found.exception';
import { UnprocessableEntityException } from '@nestjs/common';
import { Parameter } from '../../../../domain/category/parameter';
import { ParameterValueDto } from '../../../dtos/write/offer/parameter-value.dto';
import { InvalidParameterValueException } from '../../../exceptions/invalid-parameter-value.exception';

@CommandHandler(CreateDraftOfferCommand)
export class CreateDraftOfferHandler
  implements ICommandHandler<CreateDraftOfferCommand> {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly parameterValidator: ParameterValidator,
  ) {}

  public async execute(command: CreateDraftOfferCommand): Promise<void> {
    const customer: Customer = await this.customerRepository.findOne(
      command.newDraftOffer.customer.uid,
    );

    if (command.newDraftOffer.category) {
      const category: Category = await this.categoryRepository.findOne(
        command.newDraftOffer.category.id,
      );
      await this.checkCategoryCorrectness(category);
      await this.checkIfCategoryHasGivenParameters(
        category,
        command.newDraftOffer.parameters,
      );
      const parameterValidationErrors: string[] = await this.validOfferParameters(
        category,
        command.newDraftOffer.parameters,
      );
      if (parameterValidationErrors.length > 0) {
        throw new InvalidParameterValueException(parameterValidationErrors);
      }
    }

    const newDraftOffer: Offer = Offer.create(command.newDraftOffer);
    // @ts-ignore
    newDraftOffer.description = JSON.stringify(newDraftOffer.description);
    await customer.createDraftOffer(newDraftOffer);
    await this.customerRepository.save(customer);
  }

  private async checkCategoryCorrectness(category: Category): Promise<void> {
    if (!category) {
      throw new CategoryNotFoundException();
    }
    if (!category.leaf) {
      throw new UnprocessableEntityException(
        'Wybrana kategoria posiada podkategorie i nie można dodawać do niej ofert.',
      );
    }
  }

  private async checkIfCategoryHasGivenParameters(
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

  private async validOfferParameters(
    category: Category,
    parameters: ParameterValueDto[],
  ): Promise<string[]> {
    const errors: any = parameters.map(
      async (candidateParameter: ParameterValueDto) => {
        const parameter: Parameter = (await category.parameters).find(
          categoryParameter => categoryParameter.id === candidateParameter.id,
        );
        if (
          !this.parameterValidator.validate(candidateParameter.value, parameter)
        ) {
          return [
            `Wartość parametru ${
              candidateParameter.name
            } nie spełnia określonych wymagań: `,
            parameter.restrictions,
          ];
        }
      },
    );

    const resolvedErrors: any[] = await Promise.all(errors);
    if (resolvedErrors.filter(el => el !== undefined).length > 0) {
      return resolvedErrors;
    }
    return [];
  }
}
