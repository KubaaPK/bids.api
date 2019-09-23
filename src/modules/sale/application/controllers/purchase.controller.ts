import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
  ApiUseTags,
} from '@nestjs/swagger';
import { AppLogger } from '../../../common/app-logger';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../auth/application/guards/roles.guard';
import { roles } from '../../../auth/application/guards/roles.decorator';
import { AccountRole } from '../../../account/domain/account-role.enum';
import { Response } from 'express';
import { NewPurchaseDto } from '../dtos/write/purchase/new-purchase.dto';
import { ExceptionMessages } from '../../../common/exception-messages';
import { Uuid } from '../../../common/uuid';
import { MakePurchaseCommand } from '../commands/customer/make-purchase/make-purchase.command';

@ApiUseTags('purchases')
@Controller('/sale/purchases')
export class PurchaseController {
  private readonly logger: AppLogger = new AppLogger(
    PurchaseController.name,
    true,
  );

  constructor(private readonly commandBus: CommandBus) {}

  @ApiCreatedResponse({ description: 'Purchase has been made.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiNotFoundResponse({ description: 'Offer not found.' })
  @ApiUnprocessableEntityResponse({
    description: 'You are trying buy own product.',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
  @Post()
  @UseGuards(AuthGuard('bearer'), RolesGuard)
  @roles(AccountRole.USER)
  @HttpCode(HttpStatus.CREATED)
  public async create(
    @Req() request,
    @Res() response: Response,
    @Body() newPurchase: NewPurchaseDto,
  ): Promise<void> {
    try {
      const id: Uuid = Uuid.v4();
      newPurchase.id = id;
      newPurchase.buyerId = request.user.uid;

      await this.commandBus.execute(new MakePurchaseCommand(newPurchase));

      response
        .header({
          Location: `${process.env.APP_API_ROOT_URL}/sale/purchases/${id}`,
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
