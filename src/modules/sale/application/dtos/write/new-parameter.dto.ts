import { Uuid } from '../../../../common/uuid';
import { ParameterType } from '../../../domain/category/parameter-type.enum';
import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ParameterRestrictionsDto } from './parameter-restrictions.dto';
import { EnumUtils } from '../../../../common/utils/enum-utils';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class NewParameterDto {
  public id: Uuid;

  @ApiModelProperty({
    type: String,
    example: `Przekątna ekranu`,
    description: 'Parameter name.',
    required: true,
  })
  @IsNotEmpty({
    message: 'Nazwa parametru jest wymagana.',
  })
  public readonly name: string;

  @ApiModelProperty({
    enum: ParameterType,
    example: `${ParameterType.FLOAT}`,
    description: 'Parameter type.',
    required: true,
  })
  @IsEnum(ParameterType, {
    message: `Niepoprawny typ parametru. Poprawne typy: ${EnumUtils.printEnumValues(
      ParameterType,
    )}.`,
  })
  public readonly type: ParameterType;

  @ApiModelPropertyOptional({
    type: Boolean,
    example: false,
    description: 'Determine if parameter is required.',
  })
  @IsOptional()
  @IsBoolean()
  public readonly required?: boolean;

  @ApiModelPropertyOptional({
    type: String,
    example: `cale`,
    description: 'The unit of given parameter.',
  })
  @IsOptional()
  public readonly unit?: string;

  @ApiModelPropertyOptional({
    type: [String],
    description:
      'If parameter is Dictionary type the dictionary values goes here.',
  })
  @IsOptional()
  @IsArray({
    message: 'Elementy słownika muszą być przekazane w tablicy.',
  })
  public readonly dictionary?: string[];

  @ApiModelProperty({
    type: ParameterRestrictionsDto,
    example: {
      min: 1.0,
      max: 1000.0,
      precision: 2,
    },
    description: 'Set of parameter restrictions.',
  })
  @IsDefined({
    message: 'Ogarniczenia parametru muszą być zdefiniowane.',
  })
  @ValidateNested()
  @Type(() => ParameterRestrictionsDto)
  public readonly restrictions: ParameterRestrictionsDto;
}
