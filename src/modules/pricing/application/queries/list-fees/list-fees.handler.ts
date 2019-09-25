import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListFeesQuery } from './list-fees.query';
import { FeeRepository } from '../../../domain/fee/fee.repository';
import { Fee } from '../../../domain/fee/fee';
import { FeeStatus } from '../../../domain/fee/fee-status';
import { plainToClass } from 'class-transformer';
import { ListableFeeDto } from '../../dtos/read/listable-fee.dto';

@QueryHandler(ListFeesQuery)
export class ListFeesHandler implements IQueryHandler<ListFeesQuery> {
  constructor(private readonly feeRepository: FeeRepository) {}

  public async execute(query: ListFeesQuery): Promise<ListableFeeDto[]> {
    const fees: Fee[] = await this.feeRepository.find(query.debtorId);
    return fees
      .filter((fee: Fee) => fee.status === query.status)
      .map((fee: Fee) => plainToClass(ListableFeeDto, fee));
  }
}
