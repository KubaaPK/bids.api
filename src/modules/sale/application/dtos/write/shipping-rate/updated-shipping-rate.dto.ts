import { ShippingRateItemDto } from './shipping-rate-item.dto';
import { ApiModelProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Uuid } from '../../../../../common/uuid';

export class UpdatedShippingRateDto {
  public id: Uuid;

  @ApiModelProperty({
    description: 'Shipping rate name.',
    required: true,
    type: String,
    example: 'Cennik dla elektroniki.',
  })
  @IsOptional()
  @IsNotEmpty({
    message: 'Nazwa cennika jest wymagana.',
  })
  public readonly name?: string;

  @ApiModelProperty({
    type: ShippingRateItemDto,
  })
  @IsOptional()
  @IsArray({
    message: 'Poszczególne elementy cennika muszą być przekazane w tablicy.',
  })
  @ArrayMinSize(1, {
    message: 'Należy zdefiniować przynajmniej jeden element cennika.',
  })
  @ValidateNested({ each: true })
  @Type(() => ShippingRateItemDto)
  public readonly rates?: ShippingRateItemDto[];
}
