import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiUseTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AppLogger } from '../../../../common/app-logger';
import { NewCategoryDto } from '../dtos/write/new-category.dto';
import { Uuid } from '../../../../common/uuid';
import { CreateCategoryCommand } from '../commands/admin/create-category/create-category.command';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../auth/application/guards/roles.guard';
import { roles } from '../../../auth/application/guards/roles.decorator';
import { ListableCategoryDto } from '../dtos/read/listable-category.dto';
import { ExceptionMessages } from '../../../../common/exception-messages';
import { ListCategoriesQuery } from '../queries/list-categories/list-categories.query';
import { ListCategoryQuery } from '../queries/list-category/list-category.query';

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
}
