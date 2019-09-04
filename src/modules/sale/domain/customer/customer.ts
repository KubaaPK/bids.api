import { Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { ShippingRate } from './shipping-rate/shipping-rate';
import { ToManyShippingRatesDefinedException } from './exceptions/to-many-shipping-rates-defined.exception';
import { ShippingRateAlreadyExistsException } from './exceptions/shipping-rate-already-exists.exception';
import { Uuid } from '../../../common/uuid';

@Entity('customers')
export class Customer {
  @PrimaryColumn('uuid')
  public id: Uuid;

  @OneToMany(type => ShippingRate, shippingRate => shippingRate.customer, {
    cascade: true,
  })
  public shippingRates: Promise<ShippingRate[]>;

  public async createShippingRate(
    newShippingRate: ShippingRate,
  ): Promise<void> {
    const existingShippingRates: ShippingRate[] = await this.shippingRates;
    if (
      existingShippingRates.length ===
      ShippingRate.MAXIMUM_AMOUNT_OF_SHIPPING_RATES
    ) {
      throw new ToManyShippingRatesDefinedException();
    }

    existingShippingRates.map((shippingRate: ShippingRate) => {
      if (shippingRate.name === newShippingRate.name) {
        throw new ShippingRateAlreadyExistsException();
      }
    });
    existingShippingRates.push(newShippingRate);
  }

  public static create(id: Uuid): Customer {
    const customer: Customer = new Customer();
    customer.id = id;

    return customer;
  }
}
