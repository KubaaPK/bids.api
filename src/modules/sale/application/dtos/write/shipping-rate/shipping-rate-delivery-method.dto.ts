import { IsUUID } from 'class-validator';
import { Uuid } from '../../../../../common/uuid';
import { ApiModelProperty } from '@nestjs/swagger';

export class ShippingRateDeliveryMethodDto {
  @ApiModelProperty({
    description: 'Id of delivery method.',
    required: true,
    type: String,
    example: 'c20f8fdb-3523-46a9-a23c-c314ecd67284',
  })
  @IsUUID('4', {
    message: 'Niepoprawne ID metody dostawy.',
  })
  public readonly id: Uuid;
}
