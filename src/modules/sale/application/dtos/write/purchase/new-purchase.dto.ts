import { Uuid } from '../../../../../common/uuid';
import { IsNumber, IsUUID, IsNumberString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class NewPurchaseDto {
  public id: Uuid;
  public buyerId: Uuid;

  @ApiModelProperty({
    type: String,
    required: true,
    example: '28ee1b10-8b35-485e-b4c8-0eb3eb00b36d',
    description: 'Offer id.',
  })
  @IsUUID('4', {
    message: 'ID oferty nie jest poprawnym UUID w wersji 4.',
  })
  public readonly offerId: Uuid;

  @ApiModelProperty({
    type: Number,
    required: true,
    example: 3,
    description: 'Product amount to bought.',
  })
  @IsNumberString(
    // { allowInfinity: false, allowNaN: false },
    {
      message: 'Należy zdefiniować liczbę zakupionych sztuk danego przedmiotu.',
    },
  )
  public readonly amount: number;
}
