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
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiImplicitParam,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiUseTags,
} from '@nestjs/swagger';
import { AppLogger } from '../../../common/app-logger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../auth/application/guards/roles.guard';
import { roles } from '../../../auth/application/guards/roles.decorator';
import { ExceptionMessages } from '../../../common/exception-messages';
import { Uuid } from '../../../common/uuid';
import { CreateDeliveryMethodCommand } from '../commands/admin/create-delivery-method/create-delivery-method.command';
import { Response } from 'express';
import { NewDeliveryMethodDto } from '../dtos/write/new-delivery-method.dto';
import { ListableDeliveryMethodDto } from '../dtos/read/listable-delivery-method.dto';
import { ListDeliveryMethodsQuery } from '../queries/customer/list-delivery-methods/list-delivery-methods.query';
import { DeleteDeliveryMethodCommand } from '../commands/admin/delete-delivery-method/delete-delivery-method.command';

@ApiUseTags('delivery-methods')
@Controller('sale/delivery-methods')
export class DeliveryMethodController {
  private readonly logger: AppLogger = new AppLogger(
    DeliveryMethodController.name,
    true,
  );

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @ApiCreatedResponse({ description: 'Delivery method has been created.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({
    description: ExceptionMessages.DOCUMENTATION_ADMIN_FORBIDDEN_EXCEPTION,
  })
  @ApiConflictResponse({
    description:
      'Delivery method with given name and payment policy already exists.',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard('bearer'), RolesGuard)
  @roles('admin')
  public async create(
    @Res() response: Response,
    @Body() newDeliveryMethod: NewDeliveryMethodDto,
  ): Promise<void> {
    try {
      const id: Uuid = Uuid.v4();
      newDeliveryMethod.id = id;

      await this.commandBus.execute(
        new CreateDeliveryMethodCommand(newDeliveryMethod),
      );

      response
        .header({
          Location: `${
            process.env.APP_API_ROOT_URL
          }/sale/delivery-methods/${id}`,
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
    description: 'Array with delivery methods.',
    type: [ListableDeliveryMethodDto],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('bearer'), RolesGuard)
  @roles('user')
  public async getAll(): Promise<ListableDeliveryMethodDto[]> {
    try {
      return await this.queryBus.execute(new ListDeliveryMethodsQuery());
    } catch (e) {
      this.logger.error(e.message);
      throw e ||
        new InternalServerErrorException(
          ExceptionMessages.GENERIC_INTERNAL_SERVER_ERROR,
        );
    }
  }

  @ApiNoContentResponse({ description: 'Delivery method has been deleted.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiNotFoundResponse({
    description: 'Delivery method with given id does not exist.',
  })
  @ApiForbiddenResponse({
    description: ExceptionMessages.DOCUMENTATION_ADMIN_FORBIDDEN_EXCEPTION,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
  @ApiImplicitParam({
    type: Uuid,
    required: true,
    description: 'Delivery method id.',
    name: 'deliveryMethodId',
  })
  @Delete('/:deliveryMethodId')
  @UseGuards(AuthGuard('bearer'), RolesGuard)
  @roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(
    @Param('deliveryMethodId') deliveryMethodId: Uuid,
  ): Promise<void> {
    try {
      await this.commandBus.execute(
        new DeleteDeliveryMethodCommand(deliveryMethodId),
      );
    } catch (e) {
      this.logger.error(e.message);
      throw e ||
        new InternalServerErrorException(
          ExceptionMessages.GENERIC_INTERNAL_SERVER_ERROR,
        );
    }
  }
}
