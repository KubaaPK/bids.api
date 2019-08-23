import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { ApiModelPropertyOptional } from '@nestjs/swagger';

export class ParameterRestrictionsDto {
  @ApiModelPropertyOptional({
    type: Number,
    example: 1.0,
    description: 'Minimal value of parameter.',
  })
  @IsOptional()
  @IsNumber(
    {
      allowInfinity: false,
      allowNaN: false,
    },
    {
      message: 'Wartość minimalna parametru być liczbą.',
    },
  )
  public readonly min?: number;

  @ApiModelPropertyOptional({
    type: Number,
    example: 1000.0,
    description: 'Maximum value of parameter.',
  })
  @IsOptional()
  @IsNumber(
    {
      allowInfinity: false,
      allowNaN: false,
    },
    {
      message: 'Wartość maksymalna parametru być liczbą.',
    },
  )
  public readonly max?: number;

  @ApiModelPropertyOptional({
    type: Number,
    example: 2,
    description: 'Precision of minimal and maximum values of the parameter.',
  })
  @IsOptional()
  @IsNumber(
    {
      allowInfinity: false,
      allowNaN: false,
    },
    {
      message: 'Dokładność musi być określona liczbą.',
    },
  )
  public readonly precision?: number;

  @ApiModelPropertyOptional({
    type: Number,
    example: 3,
    description: 'Minimal character long of parameter value.',
  })
  @IsOptional()
  @IsNumber(
    {
      allowInfinity: false,
      allowNaN: false,
    },
    {
      message: 'Minimalna długość parametru być liczbą.',
    },
  )
  public readonly minLength?: number;

  @ApiModelPropertyOptional({
    type: Number,
    example: 10,
    description: 'Maximum character long of parameter value.',
  })
  @IsOptional()
  @IsNumber(
    {
      allowInfinity: false,
      allowNaN: false,
    },
    {
      message: 'Maksymalna długość parametru być liczbą.',
    },
  )
  public readonly maxLength?: number;

  @ApiModelPropertyOptional({
    type: Boolean,
    example: false,
    description:
      'Determine if dictionary type parameter can have multiple choices.',
  })
  @IsOptional()
  @IsBoolean({
    message: 'multipleChoices musi mieć wartość typu boolean.',
  })
  public readonly multipleChoices?: boolean;
}
