import { CurrencyRate } from '../../../../../common/value-objects/currency-rate';
import { SellingModeFormat } from '../../../../domain/offer/selling-mode';
import { IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { EnumUtils } from '../../../../../common/utils/enum-utils';
import { CurrencyRateDto } from './currency-rate.dto';
import { Type } from 'class-transformer';
import {
  ApiModelProperty,
  ApiModelPropertyOptional,
  ApiOperation,
} from '@nestjs/swagger';

export class SellingModeDto {
  @ApiModelProperty({
    enum: SellingModeFormat,
    required: true,
    example: SellingModeFormat.BUY_NOW,
  })
  @IsEnum(SellingModeFormat, {
    message: `Nieprawidłowy format sprzedaży. Poprawne formaty to: ${EnumUtils.printEnumValues(
      SellingModeFormat,
    )}.`,
  })
  public format: SellingModeFormat;

  @ApiModelPropertyOptional({
    type: CurrencyRateDto,
  })
  @ValidateNested()
  @Type(() => CurrencyRateDto)
  public price: CurrencyRate;

  @ApiModelPropertyOptional({
    type: CurrencyRateDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CurrencyRateDto)
  public minimalPrice?: CurrencyRate | null;

  @ApiModelPropertyOptional({
    type: CurrencyRateDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CurrencyRateDto)
  public startingPrice?: CurrencyRate | null;
}
