import { IsUUID } from 'class-validator';
import { Uuid } from '../../../../../common/uuid';
import { ApiModelProperty } from '@nestjs/swagger';

enum PaymentPolicy {
  'IN_ADVANCE',
  'CASH_ON_DELIVERY',
}

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

  @ApiModelProperty({
    description: 'Delivery method name.',
    required: true,
    type: String,
    example: 'Przesyłka kurierska.',
  })
  public readonly name: string;

  @ApiModelProperty({
    description: 'Payment policy.',
    required: true,
    type: PaymentPolicy,
    example: 'IN_ADVANCE',
  })
  public readonly paymentPolicy: 'IN_ADVANCE' | 'CASH_ON_DELIVERY';
}
