import { Exclude, Expose, Transform, plainToClass } from 'class-transformer';
import { Uuid } from '../../../../../common/uuid';

@Exclude()
class ListableIssuedReviewPurchaseOfferDto {
  @Expose()
  public readonly id: Uuid;

  @Expose()
  public readonly name: string;

  @Expose()
  public readonly sellingMode: any;

  @Expose()
  @Transform(value => value[0])
  public readonly images: any;
}

@Exclude()
export class ListableIssuedReviewPurchaseDto {
  @Expose()
  public readonly id: Uuid;

  @Expose({ name: '__offer__' })
  @Transform(value => plainToClass(ListableIssuedReviewPurchaseOfferDto, value))
  public readonly offer: ListableIssuedReviewPurchaseOfferDto;
}
