import { IsEnum, IsIn, IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

enum Currencies {
  PLN = 'PLN',
  USD = 'USD',
  EUR = 'EUR',
}

export class CurrencyRateDto {
  @ApiModelProperty({
    type: String,
    required: true,
    example: '10.50',
  })
  @IsNotEmpty({
    message: 'Cena jest wymagana.',
  })
  public readonly amount: string;

  @ApiModelProperty({
    enum: Currencies,
    required: true,
    example: Currencies.PLN,
  })
  @IsEnum(Currencies, {
    message: 'Dostępne waluty to: PLN, EUR, USD.',
  })
  public readonly currency: string;
}
