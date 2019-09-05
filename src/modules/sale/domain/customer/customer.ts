import { Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { ShippingRate } from './shipping-rate/shipping-rate';
import { ToManyShippingRatesDefinedException } from './exceptions/to-many-shipping-rates-defined.exception';
import { ShippingRateAlreadyExistsException } from './exceptions/shipping-rate-already-exists.exception';
import { Uuid } from '../../../common/uuid';
import { ShippingRateNotFoundException } from './exceptions/shipping-rate-not-found.exception';
import { UpdatedShippingRateDto } from '../../application/dtos/write/shipping-rate/updated-shipping-rate.dto';

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

  public async deleteShippingRate(shippingRateId: Uuid): Promise<void> {
    const existingShippingRates: ShippingRate[] = await this.shippingRates;
    const shippingRateToDeleteIdx: number = existingShippingRates.findIndex(
      el => el.id === shippingRateId,
    );

    if (shippingRateToDeleteIdx === -1) {
      throw new ShippingRateNotFoundException();
    }

    existingShippingRates.splice(shippingRateToDeleteIdx, 1);
  }

  public async updateShippingRate(
    updatedShippingRate: UpdatedShippingRateDto,
  ): Promise<void> {
    const existingShippingRates: ShippingRate[] = await this.shippingRates;
    const shippingRateToUpdateIdx: number = existingShippingRates.findIndex(
      el => el.id === updatedShippingRate.id,
    );

    if (shippingRateToUpdateIdx === -1) {
      throw new ShippingRateNotFoundException();
    }

    existingShippingRates[shippingRateToUpdateIdx].name =
      updatedShippingRate.name;
    existingShippingRates[shippingRateToUpdateIdx].rates =
      updatedShippingRate.rates;
  }

  public static create(id: Uuid): Customer {
    const customer: Customer = new Customer();
    customer.id = id;

    return customer;
  }
}
