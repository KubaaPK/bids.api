import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateDraftOfferCommand } from './update-draft-offer.command';
import { CustomerRepository } from '../../../../domain/customer/customer.repository';
import { CategoryRepository } from '../../../../domain/category/category.repository';
import { Customer } from '../../../../domain/customer/customer';
import { ParameterValidator } from '../../../services/parameter-validator/parameter-validator';
import { CategoryValidator } from '../../../services/category-validator/category-validator';
import { Category } from '../../../../domain/category/category';
import { ParameterValueDto } from '../../../dtos/write/offer/parameter-value.dto';
import { Parameter } from '../../../../domain/category/parameter';
import { InvalidParameterValueException } from '../../../exceptions/invalid-parameter-value.exception';
import { ImageUploader } from '../../../services/image-uploader/image-uploader';

@CommandHandler(UpdateDraftOfferCommand)
export class UpdateDraftOfferHandler
  implements ICommandHandler<UpdateDraftOfferCommand> {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly parameterValidator: ParameterValidator,
    private readonly categoryValidator: CategoryValidator,
    private readonly imageUploader: ImageUploader,
  ) {}

  public async execute(command: UpdateDraftOfferCommand): Promise<any> {
    const customer: Customer = await this.customerRepository.findOne(
      command.updatedDraftOffer.customer.uid,
    );

    if (command.updatedDraftOffer.category) {
      const category: Category = await this.categoryRepository.findOne(
        command.updatedDraftOffer.category.id,
      );
      if (command.updatedDraftOffer.parameters) {
        await this.categoryValidator.checkCategoryCorrectness(category);
        await this.categoryValidator.checkIfCategoryHasGivenParameters(
          category,
          command.updatedDraftOffer.parameters,
        );
        const parameterValidationErrors: string[] = await this.validOfferParameters(
          category,
          command.updatedDraftOffer.parameters,
        );
        if (parameterValidationErrors.length > 0) {
          throw new InvalidParameterValueException(parameterValidationErrors);
        }
      }
      await this.categoryValidator.checkCategoryCorrectness(category);
    }

    let uploadedImagesUrls: string[] = [];
    if (
      command.updatedDraftOffer.images &&
      command.updatedDraftOffer.images.length > 0
    ) {
      uploadedImagesUrls = await this.handleImageUpload(
        command.updatedDraftOffer.images,
      );
      command.updatedDraftOffer.images = uploadedImagesUrls;
    }

    if (command.updatedDraftOffer.description === null || undefined) {
      delete command.updatedDraftOffer.description;
    }

    await customer.updateDraftOffer(command.offerId, command.updatedDraftOffer);
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
