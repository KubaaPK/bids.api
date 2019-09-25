import { Uuid } from '../../../../common/uuid';
import { FeeStatus } from '../../../domain/fee/fee-status';
import { Exclude, Expose } from 'class-transformer';
import { ApiResponseModelProperty } from '@nestjs/swagger';

@Exclude()
export class ListableFeeDto {
  @ApiResponseModelProperty({
    type: String,
    example: '7d28400e-3464-4faa-8b61-b3c3dbcb3667',
  })
  @Expose()
  public readonly id: Uuid;

  @ApiResponseModelProperty({
    type: Object,
    example: {
      currency: 'PLN',
      amount: '0.62',
    },
  })
  @Expose()
  public readonly fee: {
    currency: string;
    amount: string;
  };

  @ApiResponseModelProperty({
    type: [FeeStatus],
    example: FeeStatus.UN_PAID,
  })
  @Expose()
  public readonly status: FeeStatus;

  @ApiResponseModelProperty({
    type: Date,
    example: '2019-09-24T10:12:48.575Z',
  })
  @Expose()
  public readonly createdAt: Date;

  @ApiResponseModelProperty({
    type: Object,
    example: {
      id: '257d21f5-c394-4095-aaf0-0a49fa703fc2',
      amount: 1,
      createdAt: '2019-09-24T10:12:48.511Z',
    },
  })
  @Expose()
  public readonly purchase: {
    id: Uuid;
    amount: number;
    createdAt: Date;
  };
}
