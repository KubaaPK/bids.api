import { Exclude, Expose, plainToClass, Transform } from 'class-transformer';
import { Uuid } from '../../../../../common/uuid';
import { ListableOfferDto } from '../offer/listable-offer.dto';

@Exclude()
export class ListablePurchaseDto {
  @Expose()
  public readonly id: Uuid;

  @Expose()
  public readonly amount: number;

  @Expose({ name: '__offer__' })
  @Transform(value => plainToClass(ListableOfferDto, value))
  public readonly offer: ListableOfferDto;

  @Expose()
  public readonly createdAt: Date;
}
