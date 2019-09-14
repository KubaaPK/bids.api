import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AppLogger } from '../../../common/app-logger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../auth/application/guards/roles.guard';
import { roles } from '../../../auth/application/guards/roles.decorator';
import { AccountRole } from '../../../account/domain/account-role.enum';
import { ExceptionMessages } from '../../../common/exception-messages';
import { CreateDraftOfferCommand } from '../commands/customer/create-draft-offer/create-draft-offer.command';
import { NewDraftOfferDto } from '../dtos/write/offer/new-draft-offer.dto';
import { Uuid } from '../../../common/uuid';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
  ApiUseTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { UpdatedDraftOfferDto } from '../dtos/write/offer/updated-draft-offer.dto';
import { UpdateDraftOfferCommand } from '../commands/customer/update-draft-offer/update-draft-offer.command';
import { ListableDraftOfferDto } from '../dtos/read/listable-draft-offer.dto';
import { ListDraftOffersQuery } from '../queries/customer/list-draft-offers/list-draft-offers.query';

@ApiUseTags('offers')
@Controller('sale/offers')
export class OfferController {
  private readonly logger: AppLogger = new AppLogger(
    OfferController.name,
    true,
  );

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @ApiCreatedResponse({ description: 'Draft offer has been created.' })
  @ApiBadRequestResponse({ description: 'Validation errors.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiNotFoundResponse({
    description: 'Category with given id does not exist.',
  })
  @ApiUnprocessableEntityResponse({
    description:
      'Category is not the leaf | Category does not have given parameters | Invalid parameters values',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
  @Post()
  @UseGuards(AuthGuard('bearer'), RolesGuard)
  @roles(AccountRole.USER)
  public async create(
    @Res() response: Response,
    @Req() request,
    @Body() newDraftOffer: NewDraftOfferDto,
  ): Promise<void> {
    try {
      const id: Uuid = Uuid.v4();
      newDraftOffer.id = id;
      newDraftOffer.customer = request.user;
      await this.commandBus.execute(new CreateDraftOfferCommand(newDraftOffer));

      response
        .header({
          Location: `${process.env.APP_API_ROOT_URL}/sale/offers/${id}`,
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

  @ApiCreatedResponse({ description: 'Draft offer has been updated.' })
  @ApiBadRequestResponse({ description: 'Validation errors.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiNotFoundResponse({
    description:
      'Category with given id does not exist. | Draft offer has not been found.',
  })
  @ApiUnprocessableEntityResponse({
    description:
      'Category is not the leaf | Category does not have given parameters | Invalid parameters values',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
  @Patch('/:offerId')
  @UseGuards(AuthGuard('bearer'), RolesGuard)
  @roles(AccountRole.USER)
  @HttpCode(HttpStatus.OK)
  public async update(
    @Req() request,
    @Res() response: Response,
    @Param('offerId') offerId: Uuid,
    @Body() updatedDraftOffer: UpdatedDraftOfferDto,
  ): Promise<void> {
    try {
      updatedDraftOffer.customer = request.user;
      await this.commandBus.execute(
        new UpdateDraftOfferCommand(offerId, updatedDraftOffer),
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

  @Get('/drafts')
  @UseGuards(AuthGuard('bearer'), RolesGuard)
  @roles(AccountRole.USER)
  public async getAllDrafts(
    @Req() request,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<ListableDraftOfferDto[]> {
    try {
      return await this.queryBus.execute(
        new ListDraftOffersQuery(request.user, offset, limit),
      );
    } catch (e) {
      console.log(e);
      this.logger.error(e.message);
      throw new InternalServerErrorException(
        ExceptionMessages.GENERIC_INTERNAL_SERVER_ERROR,
      );
    }
  }
}
