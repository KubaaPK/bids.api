import 'dotenv/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as admin from 'firebase-admin';
import { AppController } from './app.controller';
import { DatabaseConfigFactory } from './config/database-config.factory';
import { AccountModule } from './modules/modules/account/account.module';
import { AuthModule } from './modules/modules/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(DatabaseConfigFactory.create(process.env.NODE_ENV)),
    AccountModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert(
        require(`${process.env.FIREBASE_CONFIG_JSON_PATH}`),
      ),
      databaseURL: `https://${process.env.FIREBASE_DATABASE}.firebaseio.com`,
    });
  }
}
