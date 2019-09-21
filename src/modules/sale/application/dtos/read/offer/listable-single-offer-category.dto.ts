import { Uuid } from '../../../../../common/uuid';
import { Exclude, Expose } from 'class-transformer';
import { ApiResponseModelProperty } from '@nestjs/swagger';

@Exclude()
export class ListableSingleOfferCategoryDto {
  @ApiResponseModelProperty({
    type: String,
    example: 'd706084-96a2-4517-b216-bbfca3e23569',
  })
  @Expose()
  public readonly id: Uuid;

  @ApiResponseModelProperty({
    type: String,
    example: 'Laptopy',
  })
  @Expose()
  public readonly name: string;

  @Expose()
  public readonly parent: any;

  @Expose()
  public readonly leaf: boolean;
}
