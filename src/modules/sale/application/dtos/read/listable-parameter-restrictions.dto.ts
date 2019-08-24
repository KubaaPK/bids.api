import { ApiResponseModelProperty } from '@nestjs/swagger';

export class ListableParameterRestrictionsDto {
  @ApiResponseModelProperty({
    type: String,
    example: '1.00',
  })
  public readonly min?: number;

  @ApiResponseModelProperty({
    type: String,
    example: '1000.00',
  })
  public readonly max?: number;

  @ApiResponseModelProperty({
    type: Number,
    example: 2,
  })
  public readonly precision?: number;

  @ApiResponseModelProperty({
    type: Number,
    example: null,
  })
  public readonly minLength?: number;

  @ApiResponseModelProperty({
    type: Number,
    example: null,
  })
  public readonly maxLength?: number;

  @ApiResponseModelProperty({
    type: Boolean,
    example: null,
  })
  public readonly multipleChoices?: boolean;
}
