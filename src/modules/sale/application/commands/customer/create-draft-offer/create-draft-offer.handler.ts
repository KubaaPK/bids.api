import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateDraftOfferCommand } from './create-draft-offer.command';
import { CustomerRepository } from '../../../../domain/customer/customer.repository';
import { Customer } from '../../../../domain/customer/customer';
import { Offer } from '../../../../domain/offer/offer';
import { ParameterValidator } from '../../../services/parameter-validator/parameter-validator';
import { CategoryRepository } from '../../../../domain/category/category.repository';
import { Category } from '../../../../domain/category/category';
import { Parameter } from '../../../../domain/category/parameter';
import { ParameterValueDto } from '../../../dtos/write/offer/parameter-value.dto';
import { InvalidParameterValueException } from '../../../exceptions/invalid-parameter-value.exception';
import { ImageUploader } from '../../../services/image-uploader/image-uploader';
import { CategoryValidator } from '../../../services/category-validator/category-validator';

@CommandHandler(CreateDraftOfferCommand)
export class CreateDraftOfferHandler
  implements ICommandHandler<CreateDraftOfferCommand> {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly parameterValidator: ParameterValidator,
    private readonly categoryValidator: CategoryValidator,
    private readonly imageUploader: ImageUploader,
  ) {}

  public async execute(command: CreateDraftOfferCommand): Promise<void> {
    const customer: Customer = await this.customerRepository.findOne(
      command.newDraftOffer.customer.uid,
    );

    if (command.newDraftOffer.category) {
      const category: Category = await this.categoryRepository.findOne(
        command.newDraftOffer.category.id,
      );
      await this.categoryValidator.checkCategoryCorrectness(category);
      await this.categoryValidator.checkIfCategoryHasGivenParameters(
        category,
        command.newDraftOffer.parameters,
      );

      if (command.newDraftOffer.parameters) {
        const parameterValidationErrors: string[] = await this.validOfferParameters(
          category,
          command.newDraftOffer.parameters,
        );
        if (parameterValidationErrors.length > 0) {
          throw new InvalidParameterValueException(parameterValidationErrors);
        }
      }
    }

    let uploadedImagesUrls: string[] = [];
    if (
      command.newDraftOffer.images &&
      command.newDraftOffer.images.length > 0
    ) {
      uploadedImagesUrls = await this.handleImageUpload(
        command.newDraftOffer.images,
      );
    }

    const newDraftOffer: Offer = Offer.create(
      command.newDraftOffer,
      uploadedImagesUrls,
    );
    // @ts-ignore
    newDraftOffer.description = JSON.stringify(newDraftOffer.description);
    await customer.createDraftOffer(newDraftOffer);
    await this.customerRepository.save(customer);
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

  private handleImageUpload(urls: string[]): any {
    return Promise.all(
      urls.map(async (url: string) => {
        return await this.imageUploader.fromUrl(url);
      }),
    );
  }
}
