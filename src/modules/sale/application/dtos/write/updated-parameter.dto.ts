import { ApiModelPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { ParameterType } from '../../../domain/category/parameter-type.enum';
import { EnumUtils } from '../../../../common/utils/enum-utils';
import { ParameterRestrictionsDto } from './parameter-restrictions.dto';
import { Type } from 'class-transformer';

export class UpdatedParameterDto {
  @ApiModelPropertyOptional({
    type: String,
    example: `Przekątna ekranu`,
    description: 'Parameter name.',
  })
  @IsOptional()
  @IsNotEmpty({
    message: 'Nazwa parametru jest wymagana.',
  })
  public readonly name?: string;

  @ApiModelPropertyOptional({
    enum: ParameterType,
    example: `${ParameterType.FLOAT}`,
    description: 'Parameter type.',
  })
  @IsOptional()
  @IsEnum(ParameterType, {
    message: `Niepoprawny typ parametru. Poprawne typy: ${EnumUtils.printEnumValues(
      ParameterType,
    )}.`,
  })
  public readonly type?: ParameterType;

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

  @ApiModelPropertyOptional({
    type: ParameterRestrictionsDto,
    example: {
      min: 1.0,
      max: 1000.0,
      precision: 2,
    },
    description: 'Set of parameter restrictions.',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ParameterRestrictionsDto)
  public readonly restrictions?: ParameterRestrictionsDto;
}
