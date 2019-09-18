import { StockUnit } from '../../../../domain/offer/stock-unit';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { EnumUtils } from '../../../../../common/utils/enum-utils';
import { ApiModelProperty } from '@nestjs/swagger';

export class StockDto {
  @ApiModelProperty({
    example: 1,
    description: 'Number of product available to sell.',
    type: Number,
    required: true,
  })
  @IsNotEmpty({
    message: 'Należy podać liczbę dostępnych przedmiotów.',
  })
  @IsNumber(
    {},
    {
      message: 'Ilość dostępnych przedmiotów musi być liczbą.',
    },
  )
  public readonly available: number;

  @ApiModelProperty({
    example: StockUnit.UNIT,
    description: 'Unit type.',
    enum: StockUnit,
    required: true,
  })
  @IsNotEmpty({
    message: 'Podanie jednostki jest wymagane,',
  })
  @IsEnum(StockUnit, {
    message: `Nieprawidłowa wartość pola unit. Dopuszczalne wartości to: ${EnumUtils.printEnumValues(
      StockUnit,
    )}`,
  })
  public readonly unit: StockUnit;
}
