import { Exclude, Expose, Type } from 'class-transformer';
import { Uuid } from '../../../../../common/uuid';
import { BuyerDto } from './buyer.dto';

@Exclude()
export class PurchaseDto {
  @Expose()
  public readonly id: Uuid;

  @Expose()
  public readonly amount: number;

  @Expose()
  public readonly createdAt: Date;

  @Expose({ name: '__buyer__' })
  @Type(() => BuyerDto)
  public readonly buyer: BuyerDto;
}
