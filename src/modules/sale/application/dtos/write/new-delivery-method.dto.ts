import { Uuid } from '../../../../common/uuid';
import { PaymentPolicy } from '../../../domain/delivery/payment-policy.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { EnumUtils } from '../../../../common/utils/enum-utils';
import { ApiModelProperty } from '@nestjs/swagger';

export class NewDeliveryMethodDto {
  public id: Uuid;

  @ApiModelProperty({
    example: 'Przesyłka kurierska',
    description: 'Name of new delivery method.',
    type: String,
    required: true,
  })
  @IsNotEmpty({
    message: 'Nazwa metody dostawy musi zostać zdefiniowana.',
  })
  public readonly name: string;

  @ApiModelProperty({
    example: PaymentPolicy.CASH_ON_DELIVERY,
    description: 'New delivery method payment policy.',
    type: String,
    required: true,
  })
  @IsEnum(PaymentPolicy, {
    message: `Niepoprawna wartość pola paymentPolicy. Poprawne wartości to: ${EnumUtils.printEnumValues(
      PaymentPolicy,
    )}`,
  })
  public readonly paymentPolicy: PaymentPolicy;
}
