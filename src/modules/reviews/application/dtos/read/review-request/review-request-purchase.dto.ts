import { Exclude, Expose, Type } from 'class-transformer';
import { Uuid } from '../../../../../common/uuid';
import { ReviewRequestOfferDto } from './review-request-offer.dto';

@Exclude()
export class ReviewRequestPurchaseDto {
  @Expose()
  public readonly id: Uuid;
  @Expose()
  public readonly amount: number;
  @Expose()
  public readonly createdAt: Date;
  @Expose({ name: '__offer__' })
  @Type(() => ReviewRequestOfferDto)
  public readonly offer: ReviewRequestOfferDto;
}
