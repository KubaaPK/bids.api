import { ConnectionOptions } from 'typeorm';
import { Account } from '../modules/account/domain/account';
import { Category } from '../modules/sale/domain/category/category';
import { Parameter } from '../modules/sale/domain/category/parameter';
import { DeliveryMethod } from '../modules/sale/domain/delivery/delivery-method';
import { ShippingRate } from '../modules/sale/domain/customer/shipping-rate/shipping-rate';
import { Customer } from '../modules/sale/domain/customer/customer';
import { Offer } from '../modules/sale/domain/offer/offer';
import { Purchase } from '../modules/sale/domain/purchase/purchase';

export class DatabaseConfigFactory {
  public static create(env: string): ConnectionOptions {
    switch (env) {
      case 'dev':
        return this.createDev();
      default:
        return this.createDev();
    }
  }

  private static createDev(): ConnectionOptions {
    return {
      type: 'postgres',
      database: process.env.DATABASE_DEV_NAME,
      host: process.env.DATABASE_DEV_HOST,
      port: Number.parseInt(process.env.DATABASE_DEV_PORT, 10),
      username: process.env.DATABASE_DEV_USERNAME,
      password: process.env.DATABASE_DEV_PASSWORD,
      entities: [...this.loadEntities()],
      synchronize: true,
      logging: true,
    };
  }

  private static loadEntities(): Function[] {
    return [
      Account,
      Category,
      Parameter,
      DeliveryMethod,
      ShippingRate,
      Customer,
      Offer,
      Purchase,
    ];
  }
}
