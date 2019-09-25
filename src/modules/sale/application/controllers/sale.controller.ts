import {
  Controller,
  Get,
  InternalServerErrorException,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { AppLogger } from '../../../common/app-logger';
import { QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../auth/application/guards/roles.guard';
import { roles } from '../../../auth/application/guards/roles.decorator';
import { AccountRole } from '../../../account/domain/account-role.enum';
import { ListableSaleDto } from '../dtos/read/sale/listable-sale.dto';
import { ExceptionMessages } from '../../../common/exception-messages';
import { ListSalesQuery } from '../queries/customer/list-sales/list-sales.query';

@ApiUseTags('sales')
@Controller('/sale/sales')
export class SaleController {
  private readonly logger: AppLogger = new AppLogger(SaleController.name, true);

  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @UseGuards(AuthGuard('bearer'), RolesGuard)
  @roles(AccountRole.USER)
  public async get(
    @Req() request,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<ListableSaleDto> {
    try {
      return await this.queryBus.execute(
        new ListSalesQuery(request.user.uid, offset, limit),
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
