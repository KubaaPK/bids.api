import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { AppLogger } from '../../../common/app-logger';
import { FeeCalculator } from '../../domain/fee/fee-calculator';
import { ExceptionMessages } from '../../../common/exception-messages';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../auth/application/guards/roles.guard';
import { roles } from '../../../auth/application/guards/roles.decorator';
import { AccountRole } from '../../../account/domain/account-role.enum';
import { CalculatableOfferDto } from '../dtos/write/calculatable-offer.dto';
import { CalculatedFeeDto } from '../dtos/read/calculated-fee.dto';

@ApiUseTags('fee')
@Controller('pricing/fee')
export class FeeController {
  private readonly logger: AppLogger = new AppLogger(FeeController.name, true);
  constructor(private readonly feeCalculator: FeeCalculator) {}

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
}
