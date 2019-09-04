import { Uuid } from '../../../../../common/uuid';
import { ApiModelProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { NewShippingRateItemDto } from './new-shipping-rate-item.dto';
import { Type } from 'class-transformer';

export class NewShippingRateDto {
  public id: Uuid;

  @ApiModelProperty({
    description: 'Shipping rate name.',
    required: true,
    type: String,
    example: 'Cennik dla elektroniki.',
  })
  @IsNotEmpty({
    message: 'Nazwa cennika jest wymagana.',
  })
  public readonly name: string;

  @ApiModelProperty({
    type: NewShippingRateItemDto,
  })
  @IsOptional()
  @IsArray({
    message: 'Poszczególne elementy cennika muszą być przekazane w tablicy.',
  })
  @ArrayMinSize(1, {
    message: 'Należy zdefiniować przynajmniej jeden element cennika.',
  })
  @ValidateNested({ each: true })
  @Type(() => NewShippingRateItemDto)
  public readonly rates?: NewShippingRateItemDto[];
}
