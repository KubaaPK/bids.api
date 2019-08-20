import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
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

@ApiUseTags('categories')
@Controller('sale/categories')
export class CategoryController {
  private readonly logger: AppLogger = new AppLogger(
    CategoryController.name,
    true,
  );

  constructor(private readonly commandBus: CommandBus) {}

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

    await this.commandBus.execute(new CreateCategoryCommand(newCategory));
    response
      .header({
        Location: `${process.env.APP_API_ROOT_URL}/sale/categories/${id}`,
      })
      .sendStatus(HttpStatus.CREATED);
  }
}
