import { Exclude, Expose, Transform } from 'class-transformer';
import { Uuid } from '../../../../common/uuid';
import { OfferStatus } from '../../../domain/offer/offer-status';

@Exclude()
export class ListableDraftOfferDto {
  @Expose()
  public readonly id: Uuid;

  @Expose()
  public readonly name: string;

  @Expose()
  public readonly ean: string;

  @Expose()
  @Transform(value => (value !== undefined ? JSON.parse(value) : value))
  public readonly description: any;

  @Expose()
  public readonly createdAt: Date;

  @Expose({ name: '__category__' })
  public readonly category: any;

  @Expose()
  public readonly sellingMode: any;

  @Expose()
  public readonly parameters: any;

  @Expose()
  public readonly images: string[];

  @Expose({ name: '__shippingRate__' })
  public readonly shippingRate: any;

  @Expose()
  public readonly status: OfferStatus;
}
