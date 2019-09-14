import { SellingMode } from '../../../../domain/offer/selling-mode';
import * as admin from 'firebase-admin';
import { Category } from '../../../../domain/category/category';
import { ShippingRate } from '../../../../domain/customer/shipping-rate/shipping-rate';
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
import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { OfferDescriptionDto } from './offer-description.dto';

export class UpdatedDraftOfferDto {
  @ApiModelPropertyOptional({
    type: String,
    example: 'Samsung Galaxy S10 64GB',
  })
  @IsOptional()
  @IsNotEmpty({
    message: 'Tytuł oferty jest wymagany.',
  })
  public readonly name?: string;

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

  @ApiModelPropertyOptional({
    description: 'Array with images urls.',
    example: ['https://picsum.photos/200/300', 'https://picsum.photos/200/300'],
  })
  @IsOptional()
  @IsArray({
    message: 'Zdjęcia muszą być przesłane tablicą zawierającą adresy url.',
  })
  public images?: string[];

  public customer: admin.auth.DecodedIdToken;
}
