import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ShippingRateDeliveryMethodDto } from './shipping-rate-delivery-method.dto';
import { ItemRateDto } from './item-rate.dto';
import { ApiModelProperty } from '@nestjs/swagger';

export class NewShippingRateItemDto {
  @IsNotEmpty({ message: 'Należy zdefiniować sposób dostawy.' })
  @Type(() => ShippingRateDeliveryMethodDto)
  @ValidateNested()
  public readonly deliveryMethod: ShippingRateDeliveryMethodDto;

  @ApiModelProperty({
    example: 100,
    type: Number,
    required: true,
    description: 'Number of the maximum quantity of item per package.',
  })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    {
      message: 'Pole maxQuantityPerPackager musi być liczbą.',
    },
  )
  public readonly maxQuantityPerPackage: number;

  @ApiModelProperty({
    type: ItemRateDto,
  })
  @IsNotEmpty({
    message: 'Należy zdefiniować parametry dostawy pierwszego elementu.',
  })
  @ValidateNested()
  @Type(() => ItemRateDto)
  public readonly firstItemRate: ItemRateDto;

  @ApiModelProperty({
    type: ItemRateDto,
  })
  @IsNotEmpty({
    message: 'Należy zdefiniować parametry dostawy kolejnego elementu.',
  })
  @ValidateNested()
  @Type(() => ItemRateDto)
  public readonly nextItemRate: ItemRateDto;
}
