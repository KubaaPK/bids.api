import { Exclude, Expose, Type } from 'class-transformer';
import { Uuid } from '../../../../common/uuid';
import { ParameterType } from '../../../domain/category/parameter-type.enum';
import { ListableParameterRestrictionsDto } from './listable-parameter-restrictions.dto';
import { ApiResponseModelProperty } from '@nestjs/swagger';

@Exclude()
export class ListableParameterDto {
  @ApiResponseModelProperty({
    type: Uuid,
    example: '0ccf8c91-d20c-4f5b-9703-2ce0816ae78b',
  })
  @Expose()
  public readonly id: Uuid;

  @ApiResponseModelProperty({
    type: String,
    example: 'Przekątna ekranu',
  })
  @Expose()
  public readonly name: string;

  @ApiResponseModelProperty({
    type: String,
    example: ParameterType.FLOAT,
  })
  @Expose()
  public readonly type: ParameterType;

  @ApiResponseModelProperty({
    type: String,
    example: 'cale',
  })
  @Expose()
  public readonly unit: string;

  @ApiResponseModelProperty({
    type: Boolean,
    example: false,
  })
  @Expose()
  public readonly required: boolean;

  @ApiResponseModelProperty({
    type: [String],
    example: null,
  })
  @Expose()
  public readonly dictionary: string[];

  @ApiResponseModelProperty({
    type: ListableParameterRestrictionsDto,
  })
  @Expose()
  @Type(() => ListableParameterRestrictionsDto)
  public readonly restrictions: ListableParameterRestrictionsDto;
}
