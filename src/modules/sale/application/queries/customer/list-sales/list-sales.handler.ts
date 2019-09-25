import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListSalesQuery } from './list-sales.query';
import { CustomerRepository } from '../../../../domain/customer/customer.repository';
import { Customer } from '../../../../domain/customer/customer';
import { Sale } from '../../../../domain/sale/sale';
import { plainToClass } from 'class-transformer';
import { ListableSaleDto } from '../../../dtos/read/sale/listable-sale.dto';
import { Offer } from '../../../../domain/offer/offer';

@QueryHandler(ListSalesQuery)
export class ListSalesHandler implements IQueryHandler<ListSalesQuery> {
  constructor(private readonly customerRepository: CustomerRepository) {}

  public async execute(query: ListSalesQuery): Promise<ListableSaleDto[]> {
    const customer: Customer = await this.customerRepository.findOne(
      query.sellerId,
    );

    const sales: Sale[] = await customer.listSales();

    await this.resolveLazyPromises(sales);
    return sales.map((sale: Sale) => {
      return plainToClass(ListableSaleDto, sale);
    });
  }

  private async resolveLazyPromises(sales: Sale[]): Promise<void> {
    for (let i = 0; i < sales.length; i += 1) {
      await sales[i].purchase;
      await (await sales[i].purchase).buyer;
    }
  }
}
