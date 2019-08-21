import { IsUUID } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class CategoryParentDto {
  @ApiModelProperty({
    type: String,
    example: 'c500893e-4837-4e71-a1ad-1c63c46a063c',
    description: 'Parent category id.',
    required: true,
  })
  @IsUUID('4', {
    message: 'Parent category id must be an UUID v4.',
  })
  public readonly id: string;
}
