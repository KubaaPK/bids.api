import { Uuid } from '../../../../common/uuid';
import { ReviewRatingDto } from './review-rating.dto';
import { RateType } from '../../../domain/rate-type';
import { IsEnum, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { EnumUtils } from '../../../../common/utils/enum-utils';

export class NewReviewDto {
  public id: Uuid;
  public reviewerId: Uuid;

  @IsUUID('4', {
    message: 'ID zakupu musi być UUID w wersji v4.',
  })
  public readonly purchaseId: Uuid;

  @ValidateNested()
  @Type(() => ReviewRatingDto)
  public readonly rating: ReviewRatingDto;

  @IsEnum(RateType, {
    message: `Niepoprawny typ oceny. Poprawne: ${EnumUtils.printEnumValues(
      RateType,
    )}`,
  })
  public readonly rateType: RateType;
}
