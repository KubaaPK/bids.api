import { Exclude, Expose } from 'class-transformer';
import { Uuid } from '../../../../common/uuid';
import { PaymentPolicy } from '../../../domain/delivery/payment-policy.enum';
import { ApiResponseModelProperty } from '@nestjs/swagger';

@Exclude()
export class ListableDeliveryMethodDto {
  @ApiResponseModelProperty({
    type: String,
    example: '693a0c1e-97e9-4b9b-ab63-cb952679cd76',
  })
  @Expose()
  public readonly id: Uuid;

  @ApiResponseModelProperty({
    type: String,
    example: 'Przesyłka kurierska',
  })
  @Expose()
  public readonly name: string;

  @ApiResponseModelProperty({
    type: String,
    example: PaymentPolicy.IN_ADVANCE,
  })
  @Expose()
  public readonly paymentPolicy: PaymentPolicy;
}
