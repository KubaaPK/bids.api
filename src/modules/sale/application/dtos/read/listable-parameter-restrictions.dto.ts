import { ApiResponseModelProperty } from '@nestjs/swagger';

export class ListableParameterRestrictionsDto {
  @ApiResponseModelProperty({
    type: Number,
    example: 1.0,
  })
  public readonly min: number;

  @ApiResponseModelProperty({
    type: Number,
    example: 1000.0,
  })
  public readonly max: number;

  @ApiResponseModelProperty({
    type: Number,
    example: 2,
  })
  public readonly precision: number;

  @ApiResponseModelProperty({
    type: Number,
    example: 3,
  })
  public readonly minLength: number;

  @ApiResponseModelProperty({
    type: Number,
    example: 10,
  })
  public readonly maxLength: number;

  @ApiResponseModelProperty({
    type: Boolean,
    example: false,
  })
  public readonly multipleChoices: boolean;
}
