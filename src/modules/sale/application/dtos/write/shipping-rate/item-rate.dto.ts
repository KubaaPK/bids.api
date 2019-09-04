import { IsCurrency, IsEnum, IsNotEmpty } from 'class-validator';
import { EnumUtils } from '../../../../../common/utils/enum-utils';
import { ApiModelProperty } from '@nestjs/swagger';

enum Currencies {
  USD = 'USD',
  PLN = 'PLN',
  EUR = 'EUR',
}

export class ItemRateDto {
  @ApiModelProperty({
    description: 'Currency amount.',
    required: true,
    type: String,
    example: '100.00',
  })
  @IsNotEmpty({
    message: 'Kwota musi być zdefiniowana.',
  })
  @IsCurrency(
    {
      allow_decimal: true,
    },
    {
      message:
        'Nieprawidłowy format pola amount. Przykładowy poprawny: "10.00".',
    },
  )
  public readonly amount: string;

  @ApiModelProperty({
    example: Currencies.PLN,
    enum: Currencies,
    required: true,
    description: 'ISO-4217 Currency code.',
  })
  @IsEnum(Currencies, {
    message: `Nieprawidłowa wartość pola currency. Dostępne wartości: ${EnumUtils.printEnumValues(
      Currencies,
    )}`,
  })
  public readonly currency: string;
}
