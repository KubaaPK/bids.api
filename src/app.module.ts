import 'dotenv/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as admin from 'firebase-admin';
import { AppController } from './app.controller';
import { DatabaseConfigFactory } from './config/database-config.factory';
import { AccountModule } from './modules/account/account.module';
import { AuthModule } from './modules/auth/auth.module';
import { SaleModule } from './modules/sale/sale.module';
import { PricingModule } from './modules/pricing/pricing.module';
import { PurchaseSaga } from './modules/sagas/purchase.saga';
import { ReviewsModule } from './modules/reviews/reviews.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(DatabaseConfigFactory.create(process.env.NODE_ENV)),
    AccountModule,
    AuthModule,
    SaleModule,
    PricingModule,
    ReviewsModule,
  ],
  controllers: [AppController],
  providers: [PurchaseSaga],
})
export class AppModule {
  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert(
        require(`${process.env.FIREBASE_ADMIN_SDK_KEY}`),
      ),
      databaseURL: `${process.env.FIREBASE_DATABASE}`,
    });
  }
}
