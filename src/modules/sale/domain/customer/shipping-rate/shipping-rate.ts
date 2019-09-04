import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Uuid } from '../../../../common/uuid';
import { NewShippingRateDto } from '../../../application/dtos/write/shipping-rate/new-shipping-rate.dto';
import { Customer } from '../customer';
import { ShippingRateItem } from './shipping-rate-item';

@Entity('shipping_rates')
export class ShippingRate {
  public static MAXIMUM_AMOUNT_OF_SHIPPING_RATES: number = 100;

  @PrimaryColumn('uuid')
  public id: Uuid;

  @Column({
    nullable: false,
  })
  public name: string;

  @Column({
    nullable: true,
    type: 'simple-json',
  })
  public rates: ShippingRateItem[];

  @ManyToOne(type => Customer, customer => customer.shippingRates)
  public customer: Customer;

  public static create(dto: NewShippingRateDto): ShippingRate {
    const shippingRate: ShippingRate = new ShippingRate();
    shippingRate.id = dto.id;
    shippingRate.name = dto.name;
    shippingRate.rates = dto.rates;

    return shippingRate;
  }
}
