import { Exclude, Expose, Transform, plainToClass } from 'class-transformer';
import { Uuid } from '../../../../../common/uuid';
import { ListableIssuedReviewPurchaseDto } from './listable-issued-review-purchase.dto';

@Exclude()
export class ListableIssuedReviewDto {
  @Expose()
  public readonly id: Uuid;

  @Expose()
  public readonly rating: any;

  @Expose()
  @Transform((value: any) => {
    return {
      id: value.id,
      username: value.username,
    };
  })
  public readonly seller: {
    id: Uuid;
    username: string;
  };

  @Expose()
  @Transform(value => plainToClass(ListableIssuedReviewPurchaseDto, value))
  public readonly purchase: ListableIssuedReviewPurchaseDto;
}
