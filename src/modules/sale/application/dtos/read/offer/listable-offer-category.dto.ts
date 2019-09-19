import { Uuid } from '../../../../../common/uuid';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ListableOfferCategoryDto {
  @Expose()
  public readonly id: Uuid;
}
