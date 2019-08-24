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
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiImplicitParam,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
  ApiUseTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AppLogger } from '../../../common/app-logger';
import { NewCategoryDto } from '../dtos/write/new-category.dto';
import { Uuid } from '../../../common/uuid';
import { CreateCategoryCommand } from '../commands/admin/create-category/create-category.command';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../auth/application/guards/roles.guard';
import { roles } from '../../../auth/application/guards/roles.decorator';
import { ListableCategoryDto } from '../dtos/read/listable-category.dto';
import { ExceptionMessages } from '../../../common/exception-messages';
import { ListCategoriesQuery } from '../queries/list-categories/list-categories.query';
import { ListCategoryQuery } from '../queries/list-category/list-category.query';
import { DeleteCategoryCommand } from '../commands/admin/delete-category/delete-category.command';
import { UpdatedCategoryDto } from '../dtos/write/updated-category.dto';
import { UpdateCategoryCommand } from '../commands/admin/update-category/update-category.command';
import { LinkableParameterToCategoryDto } from '../dtos/write/linkable-parameter-to-category.dto';
import { LinkParameterToCategoryCommand } from '../commands/admin/link-parameter-to-category/link-parameter-to-category.command';

@ApiUseTags('categories')
@Controller('sale/categories')
export class CategoryController {
  private readonly logger: AppLogger = new AppLogger(
    CategoryController.name,
    true,
  );

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @ApiCreatedResponse({ description: 'Category has been added.' })
  @ApiBadRequestResponse({ description: 'Validation error. ' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden resource.' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard('bearer'), RolesGuard)
  @roles('admin')
  public async create(
    @Res() response: Response,
    @Body() newCategory: NewCategoryDto,
  ): Promise<void> {
    const id: Uuid = Uuid.v4();
    newCategory.id = id;

    try {
      await this.commandBus.execute(new CreateCategoryCommand(newCategory));
      response
        .header({
          Location: `${process.env.APP_API_ROOT_URL}/sale/categories/${id}`,
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
    description: 'An array with categories.',
    type: [ListableCategoryDto],
  })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
  @Get()
  @HttpCode(HttpStatus.OK)
  public async getAll(): Promise<ListableCategoryDto[]> {
    try {
      return await this.queryBus.execute(new ListCategoriesQuery());
    } catch (e) {
      this.logger.error(e.message);
      throw e ||
        new InternalServerErrorException(
          ExceptionMessages.GENERIC_INTERNAL_SERVER_ERROR,
        );
    }
  }

  @ApiOkResponse({ description: 'Listed category', type: ListableCategoryDto })
  @ApiBadRequestResponse({ description: 'Invalid UUID format. ' })
  @ApiNotFoundResponse({ description: 'Category not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
  @ApiImplicitParam({
    name: 'categoryId',
    type: Uuid,
    description: 'Category ID.',
    required: true,
  })
  @Get('/:categoryId')
  @HttpCode(HttpStatus.OK)
  public async get(
    @Param('categoryId') categoryId: Uuid,
  ): Promise<ListableCategoryDto> {
    try {
      return await this.queryBus.execute(new ListCategoryQuery(categoryId));
    } catch (e) {
      this.logger.error(e.message);
      throw e ||
        new InternalServerErrorException(
          ExceptionMessages.GENERIC_INTERNAL_SERVER_ERROR,
        );
    }
  }

  @ApiNoContentResponse({ description: 'Category has been deleted. ' })
  @ApiBadRequestResponse({ description: 'Invalid UUID format.' })
  @ApiNotFoundResponse({ description: 'Category not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
  @ApiImplicitParam({
    name: 'categoryId',
    type: Uuid,
    description: 'Category ID.',
    required: true,
  })
  @Delete('/:categoryId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard('bearer'), RolesGuard)
  @roles('admin')
  public async delete(
    @Res() response: Response,
    @Param('categoryId') categoryId: Uuid,
  ): Promise<void> {
    try {
      await this.commandBus.execute(new DeleteCategoryCommand(categoryId));

      response.sendStatus(HttpStatus.NO_CONTENT);
    } catch (e) {
      this.logger.error(e.message);
      throw e ||
        new InternalServerErrorException(
          ExceptionMessages.GENERIC_INTERNAL_SERVER_ERROR,
        );
    }
  }

  @ApiNoContentResponse({ description: 'Category has been updated. ' })
  @ApiBadRequestResponse({ description: 'Validation error.' })
  @ApiNotFoundResponse({ description: 'Category not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
  @ApiImplicitParam({
    name: 'categoryId',
    type: Uuid,
    description: 'Category ID.',
    required: true,
  })
  @Patch('/:categoryId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard('bearer'), RolesGuard)
  @roles('admin')
  public async update(
    @Res() response: Response,
    @Param('categoryId') categoryId: Uuid,
    @Body() updatedCategory: UpdatedCategoryDto,
  ): Promise<void> {
    try {
      await this.commandBus.execute(
        new UpdateCategoryCommand(categoryId, updatedCategory),
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

  @ApiOkResponse({ description: 'Parameter has been linked to category. ' })
  @ApiBadRequestResponse({ description: 'Validation error.' })
  @ApiConflictResponse({
    description: 'Parameter already linked to category. ',
  })
  @ApiNotFoundResponse({ description: 'Category and/or parameter not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
  @ApiImplicitParam({
    name: 'categoryId',
    type: Uuid,
    description: 'Category ID.',
    required: true,
  })
  @Post('/:categoryId/parameters')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('bearer'), RolesGuard)
  @roles('admin')
  async linkParameter(
    @Res() response: Response,
    @Param('categoryId') categoryId: Uuid,
    @Body() linkableParameter: LinkableParameterToCategoryDto,
  ): Promise<void> {
    try {
      await this.commandBus.execute(
        new LinkParameterToCategoryCommand(
          categoryId,
          linkableParameter.parameterId,
        ),
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
}
