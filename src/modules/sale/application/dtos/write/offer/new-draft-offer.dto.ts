import { Uuid } from '../../../../../common/uuid';
import { SellingMode } from '../../../../domain/offer/selling-mode';
import { Parameter } from '../../../../domain/category/parameter';
import * as admin from 'firebase-admin';
import { Category } from '../../../../domain/category/category';
import { ShippingRate } from '../../../../domain/customer/shipping-rate/shipping-rate';
import { ListableParameterDto } from '../../read/listable-parameter.dto';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { OfferCategoryDto } from './offer-category.dto';
import { Type } from 'class-transformer';
import { SellingModeDto } from './selling-mode.dto';
import { ParameterValueDto } from './parameter-value.dto';
import { ShippingRateOfferDto } from './shipping-rate-offer.dto';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { OfferDescriptionDto } from './offer-description.dto';

export class NewDraftOfferDto {
  public id: Uuid;

  @ApiModelProperty({
    type: String,
    required: true,
    example: 'Samsung Galaxy S10 64GB',
  })
  @IsNotEmpty({
    message: 'Tytuł oferty jest wymagany.',
  })
  public readonly name: string;

  @ApiModelPropertyOptional({
    type: OfferCategoryDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => OfferCategoryDto)
  public readonly category?: Category;

  @ApiModelPropertyOptional({
    type: String,
  })
  @IsOptional()
  public readonly ean?: string;

  @ApiModelPropertyOptional({
    type: SellingModeDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => SellingModeDto)
  public readonly sellingMode?: SellingMode;

  @ApiModelPropertyOptional({
    type: OfferDescriptionDto,
  })
  @ValidateNested()
  @Type(() => OfferDescriptionDto)
  @IsOptional()
  public readonly description?: OfferDescriptionDto;

  @ApiModelPropertyOptional({
    type: [ParameterValueDto],
  })
  @IsOptional()
  @IsArray({
    message: 'Parametry muszą być przesłane w tablicy.',
  })
  @ValidateNested({ each: true })
  @Type(() => ParameterValueDto)
  public readonly parameters?: ParameterValueDto[];

  @ApiModelPropertyOptional({
    type: ShippingRateOfferDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ShippingRateOfferDto)
  public readonly shippingRate?: ShippingRate;

  public customer: admin.auth.DecodedIdToken;
}
