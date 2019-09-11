import { Uuid } from '../../../../../common/uuid';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { ParameterType } from '../../../../domain/category/parameter-type.enum';
import { EnumUtils } from '../../../../../common/utils/enum-utils';
import { ApiModelProperty } from '@nestjs/swagger';

export class ParameterValueDto {
  @ApiModelProperty({
    type: String,
    required: true,
    example: '07062cdb-7030-450a-b7ae-ff10dbfff1bd',
  })
  @IsUUID('4', {
    message: 'Nieprawidłowy format ID parametru.',
  })
  public readonly id: Uuid;

  @ApiModelProperty({
    type: String,
    required: true,
    example: 'Przekątna ekranu',
  })
  @IsNotEmpty({
    message: 'Nazwa parametru nie może być pusta.',
  })
  public readonly name: string;

  @ApiModelProperty({
    enum: ParameterType,
    example: ParameterType.FLOAT,
    required: true,
  })
  @IsEnum(ParameterType, {
    message: `Nieprawidłowy typ parametru. Prawidłowe typy to: ${EnumUtils.printEnumValues(
      ParameterType,
    )}`,
  })
  public readonly type: ParameterType;

  @ApiModelProperty({
    required: true,
    type: String,
    example: '5.60',
  })
  @IsNotEmpty({
    message: 'Wartość parametru nie może być pusta.',
  })
  public readonly value: any;
}
