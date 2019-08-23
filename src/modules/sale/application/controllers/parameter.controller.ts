import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiImplicitParam,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiUseTags,
} from '@nestjs/swagger';
import { AppLogger } from '../../../common/app-logger';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../auth/application/guards/roles.guard';
import { roles } from '../../../auth/application/guards/roles.decorator';
import { Response } from 'express';
import { NewParameterDto } from '../dtos/write/new-parameter.dto';
import { ExceptionMessages } from '../../../common/exception-messages';
import { Uuid } from '../../../common/uuid';
import { CreateParameterCommand } from '../commands/admin/create-parameter/create-parameter.command';
import { DeleteParameterCommand } from '../commands/admin/delete-parameter/delete-parameter.command';

@ApiUseTags('parameters')
@Controller('sale/parameters')
export class ParameterController {
  private readonly logger: AppLogger = new AppLogger(
    ParameterController.name,
    true,
  );

  constructor(private readonly commandBus: CommandBus) {}

  @ApiCreatedResponse({ description: 'Parameter has been created. ' })
  @ApiBadRequestResponse({ description: 'Validation error.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden resource.' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard('bearer'), RolesGuard)
  @roles('admin')
  public async create(
    @Res() response: Response,
    @Body() newParameter: NewParameterDto,
  ): Promise<void> {
    try {
      const id: Uuid = Uuid.v4();
      newParameter.id = id;

      await this.commandBus.execute(new CreateParameterCommand(newParameter));

      response
        .header({
          Location: `${process.env.APP_API_ROOT_URL}/sale/parameters/${id}`,
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

  @ApiNoContentResponse({ description: 'Parameter has been deleted. ' })
  @ApiBadRequestResponse({ description: 'Invalid UUID format.' })
  @ApiNotFoundResponse({ description: 'Parameter not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
  @ApiImplicitParam({
    name: 'parameterId',
    type: Uuid,
    description: 'Parameter ID.',
    required: true,
  })
  @Delete('/:parameterId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard('bearer'), RolesGuard)
  @roles('admin')
  public async delete(@Param('parameterId') parameterId: Uuid): Promise<void> {
    try {
      await this.commandBus.execute(new DeleteParameterCommand(parameterId));
    } catch (e) {
      this.logger.error(e.message);
      throw e ||
        new InternalServerErrorException(
          ExceptionMessages.GENERIC_INTERNAL_SERVER_ERROR,
        );
    }
  }
}
