import {
  Body,
  Controller,
  Delete,
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
  ApiImplicitQuery,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
  ApiUseTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { UpdatedDraftOfferDto } from '../dtos/write/offer/updated-draft-offer.dto';
import { UpdateDraftOfferCommand } from '../commands/customer/update-draft-offer/update-draft-offer.command';
import { ListableDraftOfferDto } from '../dtos/read/listable-draft-offer.dto';
import { ListDraftOffersQuery } from '../queries/customer/list-draft-offers/list-draft-offers.query';
import { DeleteDraftOfferCommand } from '../commands/customer/delete-draft-offer/delete-draft-offer.command';
import { RequestOfferPublicationCommand } from '../commands/customer/request-offer-publication/request-offer-publication.command';
import { OfferToPublishDto } from '../dtos/write/offer/offer-to-publish.dto';
import { ListOffersQuery } from '../queries/customer/list-offers/list-offers.query';
import { ListableOfferDto } from '../dtos/read/offer/listable-offer.dto';
import { ListableSingleOfferDto } from '../dtos/read/offer/listable-single-offer.dto';
import { ListOfferQuery } from '../queries/customer/list-offer/list-offer.query';

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
          'Access-Control-Expose-Headers': '*',
        })
        .json({
          id,
        });
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
        new ListDraftOffersQuery(request.user.uid, offset, limit),
      );
    } catch (e) {
      this.logger.error(e.message);
      throw new InternalServerErrorException(
        ExceptionMessages.GENERIC_INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiNoContentResponse({ description: 'Draft offer has been deleted. ' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized. ' })
  @ApiNotFoundResponse({ description: 'Draft offer not found. ' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
  @Delete('/:offerId')
  @UseGuards(AuthGuard('bearer'), RolesGuard)
  @roles(AccountRole.USER)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(
    @Req() request,
    @Res() response: Response,
    @Param('offerId') offerId: Uuid,
  ): Promise<void> {
    try {
      await this.commandBus.execute(
        new DeleteDraftOfferCommand(request.user.uid, offerId),
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

  @ApiOkResponse({ description: 'Item has been published. ' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiNotFoundResponse({ description: 'Item not found.' })
  @ApiUnprocessableEntityResponse({ description: 'Item validation failed.' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error. ' })
  @UseGuards(AuthGuard('bearer'), RolesGuard)
  @roles(AccountRole.USER)
  @HttpCode(HttpStatus.OK)
  @Post('/publish')
  public async publish(
    @Req() request,
    @Res() response: Response,
    @Body() offer: OfferToPublishDto,
  ): Promise<void> {
    try {
      await this.commandBus.execute(
        new RequestOfferPublicationCommand(request.user.uid, offer.offerId),
      );
      response.sendStatus(HttpStatus.OK);
    } catch (e) {
      this.logger.error(e.message);
      throw e ||
        new InternalServerErrorException(
          ExceptionMessages.GENERIC_INTERNAL_SERVER_ERROR,
        );
    }
  }

  @ApiOkResponse({ description: 'List with offers.', type: [ListableOfferDto] })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error. ' })
  @ApiImplicitQuery({
    name: 'offset',
    required: false,
    description: 'Index of the first returned offer from all search results.',
    type: Number,
  })
  @ApiImplicitQuery({
    name: 'limit',
    required: false,
    description: 'The maximum number of offers.',
    type: Number,
  })
  @ApiImplicitQuery({
    name: 'seller.id',
    required: false,
    description: 'The identifier of a seller to show only his offers.',
    type: Uuid,
  })
  @ApiImplicitQuery({
    name: 'category.id',
    required: false,
    description: 'Identifier of the category, where offers will be search.',
    type: Number,
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  public async get(
    @Query('offset') offset?: number,
    @Query('limit') limit?: number,
    @Query('category.id') categoryId?: string,
    @Query('seller.id') sellerId?: string,
    @Query('order') order?: string,
    @Query('title') title?: string,
  ): Promise<ListableOfferDto> {
    try {
      return await this.queryBus.execute(
        new ListOffersQuery(offset, limit, categoryId, sellerId, order, title),
      );
    } catch (e) {
      this.logger.error(e.message);
      throw e ||
        new InternalServerErrorException(
          ExceptionMessages.GENERIC_INTERNAL_SERVER_ERROR,
        );
    }
  }

  @ApiOkResponse({
    description: 'Item object.',
    type: [ListableSingleOfferDto],
  })
  @ApiNotFoundResponse({ description: 'Item with given ID not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
  @Get('/:offerId')
  @HttpCode(HttpStatus.OK)
  public async getOne(
    @Param('offerId') offerId: Uuid,
  ): Promise<ListableSingleOfferDto> {
    try {
      return await this.queryBus.execute(new ListOfferQuery(offerId));
    } catch (e) {
      this.logger.error(e.message);
      throw e ||
        new InternalServerErrorException(
          ExceptionMessages.GENERIC_INTERNAL_SERVER_ERROR,
        );
    }
  }
}
