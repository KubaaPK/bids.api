import { Uuid } from '../../../../common/uuid';
import { Category } from '../../../domain/category/category';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { CategoryParentDto } from './category-parent.dto';
import { Type } from 'class-transformer';

export class NewCategoryDto {
  public id: Uuid;

  @ApiModelProperty({
    type: String,
    example: `TV`,
    description: 'New category name.',
    required: true,
  })
  @IsNotEmpty({
    message: 'Category cannot be empty.',
  })
  public readonly name: string;

  @ApiModelPropertyOptional({
    type: CategoryParentDto,
    example: {
      id: '455a6d47-9fe3-4fc5-8746-953fa3f7e7f4',
      name: 'Elektronika',
    },
    description: 'Parent category.',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CategoryParentDto)
  public readonly parent?: CategoryParentDto;
}
