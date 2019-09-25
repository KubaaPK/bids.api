import { Uuid } from '../../../../../common/uuid';
import { Exclude, Expose, Type } from 'class-transformer';
import { BuyerDto } from './buyer.dto';
import { PurchaseDto } from './purchase.dto';

@Exclude()
export class ListableSaleDto {
  @Expose()
  public readonly id: Uuid;

  @Expose()
  public readonly createdAt: Date;

  @Expose({ name: '__purchase__' })
  @Type(() => PurchaseDto)
  public readonly purchase: PurchaseDto;
}
