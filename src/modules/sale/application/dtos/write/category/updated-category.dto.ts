import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { CategoryParentDto } from './category-parent.dto';
import { Type } from 'class-transformer';

export class UpdatedCategoryDto {
  @ApiModelPropertyOptional({
    type: String,
    example: `TV`,
    description: 'New category name.',
  })
  @IsNotEmpty({
    message: 'Category cannot be empty.',
  })
  public readonly name?: string;

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
