import { Exclude, Expose } from 'class-transformer';
import { Uuid } from '../../../../../common/uuid';
import { ApiResponseModelProperty } from '@nestjs/swagger';

@Exclude()
export class ListableSingleOfferCustomerDto {
  @ApiResponseModelProperty({
    type: String,
    example: '6775fe9c-cc73-4e58-a7aa-fbcd2a67593d',
  })
  @Expose()
  public readonly id: Uuid;

  @ApiResponseModelProperty({
    type: String,
    example: 'janek3212',
  })
  @Expose()
  public readonly username: string;
}
