import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiUseTags,
} from '@nestjs/swagger';
import { AppLogger } from '../../../common/app-logger';
import { FeeCalculator } from '../../domain/fee/fee-calculator';
import { ExceptionMessages } from '../../../common/exception-messages';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../auth/application/guards/roles.guard';
import { roles } from '../../../auth/application/guards/roles.decorator';
import { AccountRole } from '../../../account/domain/account-role.enum';
import { CalculatableOfferDto } from '../dtos/write/calculatable-offer.dto';
import { CalculatedFeeDto } from '../dtos/read/calculated-fee.dto';
import { FeeStatus } from '../../domain/fee/fee-status';
import { QueryBus } from '@nestjs/cqrs';
import { ListFeesQuery } from '../queries/list-fees/list-fees.query';
import { ListableFeeDto } from '../dtos/read/listable-fee.dto';

@ApiUseTags('fee')
@Controller('pricing/fee')
export class FeeController {
  private readonly logger: AppLogger = new AppLogger(FeeController.name, true);
  constructor(
    private readonly feeCalculator: FeeCalculator,
    private readonly queryBus: QueryBus,
  ) {}

  @ApiOkResponse({ description: 'Calculated fee.' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
  @Post('/calculate')
  @UseGuards(AuthGuard('bearer'), RolesGuard)
  @roles(AccountRole.USER)
  public calculate(
    @Body() calculatableOffer: CalculatableOfferDto,
  ): CalculatedFeeDto {
    try {
      return this.feeCalculator.calculate(calculatableOffer);
    } catch (e) {
      this.logger.error(e.message);
      throw new InternalServerErrorException(
        ExceptionMessages.GENERIC_INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOkResponse({ description: 'List of fees.', type: [ListableFeeDto] })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
  @Get()
  @UseGuards(AuthGuard('bearer'), RolesGuard)
  @roles(AccountRole.USER)
  public async get(
    @Req() request,
    @Query('status') status: FeeStatus,
  ): Promise<ListableFeeDto> {
    try {
      return await this.queryBus.execute(
        new ListFeesQuery(request.user.uid, status),
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
