import { Uuid } from '../../../../../common/uuid';
import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class ReviewRequestOfferDto {
  @Expose()
  public readonly id: Uuid;
  @Expose({ name: 'images' })
  @Transform((value: string[]) => {
    return [{ url: value[0] }];
  })
  public readonly thumbnail: string;
  @Expose()
  public readonly name: string;
  @Expose()
  public readonly sellingMode: any;
}
