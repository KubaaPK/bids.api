import { Exclude, Expose } from 'class-transformer';
import { Uuid } from '../../../../../common/uuid';

@Exclude()
export class BuyerDto {
  @Expose()
  public id: Uuid;

  @Expose()
  public username: string;
}
