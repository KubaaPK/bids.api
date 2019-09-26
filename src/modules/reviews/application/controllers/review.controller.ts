import {
  Body,
  Controller,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { AppLogger } from '../../../common/app-logger';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../auth/application/guards/roles.guard';
import { roles } from '../../../auth/application/guards/roles.decorator';
import { AccountRole } from '../../../account/domain/account-role.enum';
import { NewReviewDto } from '../dtos/write/new-review.dto';
import { ExceptionMessages } from '../../../common/exception-messages';
import { Uuid } from '../../../common/uuid';
import { AddReviewCommand } from '../commands/add-review/add-review.command';
import { Response } from 'express';

@ApiUseTags('reviews')
@Controller('/sale/reviews')
export class ReviewController {
  private readonly logger: AppLogger = new AppLogger(
    ReviewController.name,
    true,
  );

  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @UseGuards(AuthGuard('bearer'), RolesGuard)
  @roles(AccountRole.USER)
  public async create(
    @Req() request,
    @Res() response: Response,
    @Body() mewReview: NewReviewDto,
  ): Promise<void> {
    try {
      const id: Uuid = Uuid.v4();
      mewReview.id = id;
      mewReview.reviewerId = request.user.uid;
      await this.commandBus.execute(new AddReviewCommand(mewReview));

      response
        .header({
          Location: `${process.env.APP_API_ROOT_URL}/sale/reviews/${id}`,
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
