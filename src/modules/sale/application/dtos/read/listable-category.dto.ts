import { Exclude, Expose, Type } from 'class-transformer';
import { Uuid } from '../../../../common/uuid';
import { ApiResponseModelProperty } from '@nestjs/swagger';
import { ListableCategoryParentDto } from './listable-category-parent.dto';

@Exclude()
export class ListableCategoryDto {
  @ApiResponseModelProperty({
    type: String,
    example: 'f6422f8a-5852-48d9-b4c1-6349aba8c9f2',
  })
  @Expose()
  public readonly id: Uuid;

  @ApiResponseModelProperty({
    type: Boolean,
    example: false,
  })
  @Expose()
  public readonly leaf: boolean;

  @ApiResponseModelProperty({
    type: String,
    example: 'Elektronika',
  })
  @Expose()
  public readonly name: string;

  @ApiResponseModelProperty({
    type: ListableCategoryParentDto,
    example: null,
  })
  @Expose()
  public readonly children: ListableCategoryDto;
}
