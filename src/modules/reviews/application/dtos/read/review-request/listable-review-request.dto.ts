import { Uuid } from '../../../../../common/uuid';
import { ReviewRequestPurchaseDto } from './review-request-purchase.dto';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class ListableReviewRequestDto {
  @Expose()
  public readonly id: Uuid;
  @Expose({ name: '__purchase__' })
  @Type(() => ReviewRequestPurchaseDto)
  public readonly purchase: ReviewRequestPurchaseDto;
}
