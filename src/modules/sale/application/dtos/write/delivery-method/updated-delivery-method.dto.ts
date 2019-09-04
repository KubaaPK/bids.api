import { PaymentPolicy } from '../../../../domain/delivery/payment-policy.enum';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { EnumUtils } from '../../../../../common/utils/enum-utils';
import { ApiModelProperty } from '@nestjs/swagger';

export class UpdatedDeliveryMethodDto {
  @ApiModelProperty({
    example: 'List polecony',
    description: 'Updated name of new delivery method.',
    type: String,
    required: true,
  })
  @IsOptional()
  @IsNotEmpty({
    message: 'Nazwa metody dostawy musi zostać zdefiniowana.',
  })
  public readonly name?: string;

  @ApiModelProperty({
    example: PaymentPolicy.IN_ADVANCE,
    description: 'Updated method payment policy.',
    type: String,
    required: true,
  })
  @IsOptional()
  @IsEnum(PaymentPolicy, {
    message: `Niepoprawna wartość pola paymentPolicy. Poprawne wartości to: ${EnumUtils.printEnumValues(
      PaymentPolicy,
    )}`,
  })
  public readonly paymentPolicy?: PaymentPolicy;
}
