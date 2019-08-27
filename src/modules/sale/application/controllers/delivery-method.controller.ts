import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
  ApiUseTags,
} from '@nestjs/swagger';
import { AppLogger } from '../../../common/app-logger';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../auth/application/guards/roles.guard';
import { roles } from '../../../auth/application/guards/roles.decorator';
import { ExceptionMessages } from '../../../common/exception-messages';
import { Uuid } from '../../../common/uuid';
import { CreateDeliveryMethodCommand } from '../commands/admin/create-delivery-method/create-delivery-method.command';
import { Response } from 'express';
import { NewDeliveryMethodDto } from '../dtos/write/new-delivery-method.dto';

@ApiUseTags('delivery-methods')
@Controller('sale/delivery-methods')
export class DeliveryMethodController {
  private readonly logger: AppLogger = new AppLogger(
    DeliveryMethodController.name,
    true,
  );

  constructor(private readonly commandBus: CommandBus) {}

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
}
