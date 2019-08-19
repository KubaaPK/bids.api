import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Res,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiUseTags,
} from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { Response } from 'express';
import { AppLogger } from '../../../../common/app-logger';
import { NewAccountDto } from '../dtos/write/new-account.dto';
import { CreateFirebaseUserCommand } from '../commands/create-firebase-user/create-firebase-user.command';
import { Uuid } from '../../../../common/uuid';
import { ExceptionMessages } from '../../../../common/exception-messages';

@ApiUseTags('accounts')
@Controller('accounts')
export class AccountController {
  private readonly logger: AppLogger = new AppLogger(
    AccountController.name,
    true,
  );

  constructor(private readonly commandBus: CommandBus) {}

  @ApiCreatedResponse({ description: 'Account has been created.' })
  @ApiBadRequestResponse({ description: 'Validation error.' })
  @ApiConflictResponse({
    description: 'Account with given credentials already exists.',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async create(
    @Res() response: Response,
    @Body() newAccount: NewAccountDto,
  ): Promise<void> {
    try {
      const id: Uuid = Uuid.v4();
      newAccount.id = id;
      await this.commandBus.execute(new CreateFirebaseUserCommand(newAccount));

      response
        .header({
          Location: `${process.env.APP_API_ROOT_URL}/accounts/${id}`,
        })
        .sendStatus(HttpStatus.CREATED);
    } catch (e) {
      this.logger.error(e.message);
      throw e ||
        new InternalServerErrorException(
          ExceptionMessages.GENERIC_INTERNAL_SERVER_ERROR,
        );
    }
  }
}
