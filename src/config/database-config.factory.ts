import { ConnectionOptions } from 'typeorm';
import { Account } from '../modules/account/domain/account';
import { Category } from '../modules/sale/domain/category/category';
import { Parameter } from '../modules/sale/domain/category/parameter';

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
    return [Account, Category, Parameter];
  }
}
