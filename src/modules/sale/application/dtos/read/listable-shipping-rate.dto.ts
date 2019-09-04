import { Exclude, Expose } from 'class-transformer';
import { Uuid } from '../../../../common/uuid';
import { ApiResponseModelProperty } from '@nestjs/swagger';

@Exclude()
export class ListableShippingRateDto {
  @ApiResponseModelProperty({
    type: String,
    example: '9ead9e65-28ec-4a81-a585-fd9ba43a20ab',
  })
  @Expose()
  public readonly id: Uuid;

  @ApiResponseModelProperty({
    type: String,
    example: 'Cennik dla elektroniki.',
  })
  @Expose()
  public readonly name: string;

  @ApiResponseModelProperty({
    type: Array,
    example: [
      {
        maxQuantityPerPackage: 100,
        deliveryMethod: {
          id: '69c994ed-5010-4ed3-9e84-14de83856dcf',
        },
        firstItemRate: {
          currency: 'PLN',
          amount: '10.50',
        },
        nextItemRate: {
          currency: 'EUR',
          amount: '10.00',
        },
      },
    ],
  })
  @Expose()
  public readonly rates: any;
}
