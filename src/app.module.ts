import 'dotenv/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as admin from 'firebase-admin';
import { AppController } from './app.controller';
import { DatabaseConfigFactory } from './config/database-config.factory';
import { AccountModule } from './modules/account/account.module';
import { AuthModule } from './modules/auth/auth.module';
import { SaleModule } from './modules/sale/sale.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(DatabaseConfigFactory.create(process.env.NODE_ENV)),
    AccountModule,
    AuthModule,
    SaleModule,
  ],
  controllers: [AppController],
  providers: [],
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
