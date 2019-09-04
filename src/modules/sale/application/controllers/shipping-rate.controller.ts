import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
  ApiUseTags,
} from '@nestjs/swagger';
import { AppLogger } from '../../../common/app-logger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../auth/application/guards/roles.guard';
import { roles } from '../../../auth/application/guards/roles.decorator';
import { Response } from 'express';
import { NewShippingRateDto } from '../dtos/write/shipping-rate/new-shipping-rate.dto';
import { ExceptionMessages } from '../../../common/exception-messages';
import { CreateShippingRateCommand } from '../commands/customer/create-shipping-rate/create-shipping-rate.command';
import { Uuid } from '../../../common/uuid';
import { ListableShippingRateDto } from '../dtos/read/listable-shipping-rate.dto';
import { ListShippingRatesQuery } from '../queries/customer/list-shipping-rates/list-shipping-rates.query';
import { AccountRole } from '../../../account/domain/account-role.enum';
import { DeleteShippingRateCommand } from '../commands/customer/delete-shipping-rate/delete-shipping-rate.command';

@ApiUseTags('shipping-rates')
@Controller('sale/shipping-rates')
export class ShippingRateController {
  private readonly logger: AppLogger = new AppLogger(
    ShippingRateController.name,
    true,
  );

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

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

  @ApiOkResponse({
    description: 'Array with defined shipping rates.',
    type: ListableShippingRateDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('bearer'), RolesGuard)
  @roles(AccountRole.USER)
  public async getAll(@Req() request): Promise<ListableShippingRateDto[]> {
    try {
      return await this.queryBus.execute(
        new ListShippingRatesQuery(request.user.uid),
      );
    } catch (e) {
      this.logger.error(e.message);
      throw e ||
        new InternalServerErrorException(
          ExceptionMessages.GENERIC_INTERNAL_SERVER_ERROR,
        );
    }
  }

  @ApiNoContentResponse({ description: 'Shipping rate has been deleted.' })
  @ApiBadRequestResponse({ description: 'Invalid UUID format.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiNotFoundResponse({
    description: 'Shipping rate with given id does not exists.',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
  @Delete('/:shippingRateId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard('bearer'), RolesGuard)
  @roles(AccountRole.USER)
  public async delete(
    @Req() request,
    @Res() response: Response,
    @Param('shippingRateId') shippingRateId: Uuid,
  ): Promise<void> {
    try {
      await this.commandBus.execute(
        new DeleteShippingRateCommand(request.user.uid, shippingRateId),
      );
      response.sendStatus(HttpStatus.NO_CONTENT);
    } catch (e) {
      this.logger.error(e.message);
      throw e ||
        new InternalServerErrorException(
          ExceptionMessages.GENERIC_INTERNAL_SERVER_ERROR,
        );
    }
  }
}
