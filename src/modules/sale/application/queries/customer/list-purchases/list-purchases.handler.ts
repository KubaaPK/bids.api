import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListPurchasesQuery } from './list-purchases.query';
import { CustomerRepository } from '../../../../domain/customer/customer.repository';
import { Customer } from '../../../../domain/customer/customer';
import { Purchase } from '../../../../domain/purchase/purchase';
import { plainToClass } from 'class-transformer';
import { ListablePurchaseDto } from '../../../dtos/read/purchase/listable-purchase.dto';

@QueryHandler(ListPurchasesQuery)
export class ListPurchasesHandler implements IQueryHandler<ListPurchasesQuery> {
  constructor(private readonly customerRepository: CustomerRepository) {}

  public async execute(
    query: ListPurchasesQuery,
  ): Promise<ListablePurchaseDto[]> {
    const customer: Customer = await this.customerRepository.findOne(
      query.customerId,
    );

    const purchases: Purchase[] = await customer.listPurchases();
    await this.resolveLazyPromises(purchases);
    return purchases.map((purchase: Purchase) =>
      plainToClass(ListablePurchaseDto, purchase),
    );
  }

  private async resolveLazyPromises(purchases: Purchase[]): Promise<void> {
    for (let i = 0; i < purchases.length; i += 1) {
      await purchases[i].offer;
      await (await purchases[i].offer).customer;
    }
  }
}
