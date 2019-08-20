import { Exclude, Expose } from 'class-transformer';
import { Uuid } from '../../../../../common/uuid';
import { ApiResponseModelProperty } from '@nestjs/swagger';

@Exclude()
export class ListableCategoryParentDto {
  @ApiResponseModelProperty({
    type: String,
    example: 'b62d74b3-1094-4a62-bca7-c471e5ca1d3a',
  })
  @Expose()
  public readonly id: Uuid;
}
