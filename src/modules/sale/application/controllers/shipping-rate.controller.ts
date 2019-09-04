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
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
  ApiUseTags,
} from '@nestjs/swagger';
import { AppLogger } from '../../../common/app-logger';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../auth/application/guards/roles.guard';
import { roles } from '../../../auth/application/guards/roles.decorator';
import { Response } from 'express';
import { NewShippingRateDto } from '../dtos/write/shipping-rate/new-shipping-rate.dto';
import { ExceptionMessages } from '../../../common/exception-messages';
import { CreateShippingRateCommand } from '../commands/customer/create-shipping-rate/create-shipping-rate.command';
import { Uuid } from '../../../common/uuid';

@ApiUseTags('shipping-rates')
@Controller('sale/shipping-rates')
export class ShippingRateController {
  private readonly logger: AppLogger = new AppLogger(
    ShippingRateController.name,
    true,
  );

  constructor(private readonly commandBus: CommandBus) {}

  @ApiCreatedResponse({ description: 'Shipping rate has been created.' })
  @ApiBadRequestResponse({ description: 'Validation error.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiConflictResponse({
    description: 'Shipping rate with given name already exists.',
  })
  @ApiUnprocessableEntityResponse({
    description: 'Reached maximum amount of shipping rates defined.',
  })
  @ApiInternalServerErrorResponse({ description: 'Intrnal Server Error.' })
  @Post()
  @UseGuards(AuthGuard('bearer'), RolesGuard)
  @roles('admin', 'user')
  @HttpCode(HttpStatus.CREATED)
  public async create(
    @Res() response: Response,
    @Req() request,
    @Body() newShippingRate: NewShippingRateDto,
  ): Promise<void> {
    try {
      const id: Uuid = Uuid.v4();
      newShippingRate.id = id;

      await this.commandBus.execute(
        new CreateShippingRateCommand(
          request.user.uid as Uuid,
          newShippingRate,
        ),
      );

      response
        .header({
          Location: `${process.env.APP_API_ROOT_URL}/sale/shipping-rates/${id}`,
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
