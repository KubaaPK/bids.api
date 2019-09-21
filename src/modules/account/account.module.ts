import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { commandHandlers } from './application/commands';
import { eventHandlers } from './application/events';
import { AccountController } from './application/controllers/account.controller';
import { ioCContainer } from '../../config/ioc-container';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './domain/account';
import { AccountInformationService } from './application/services/account-information/account-information.service';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Account])],
  controllers: [AccountController],
  providers: [
    ...ioCContainer,
    ...commandHandlers,
    ...eventHandlers,
    AccountInformationService,
  ],
  exports: [AccountInformationService],
})
export class AccountModule {}
