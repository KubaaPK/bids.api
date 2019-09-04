import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListShippingRatesQuery } from './list-shipping-rates.query';
import { CustomerRepository } from '../../../../domain/customer/customer.repository';
import { Customer } from '../../../../domain/customer/customer';
import { ShippingRate } from '../../../../domain/customer/shipping-rate/shipping-rate';
import { plainToClass } from 'class-transformer';
import { ListableShippingRateDto } from '../../../dtos/read/listable-shipping-rate.dto';

@QueryHandler(ListShippingRatesQuery)
export class ListShippingRatesHandler
  implements IQueryHandler<ListShippingRatesQuery> {
  constructor(private readonly customerRepository: CustomerRepository) {}

  public async execute(
    query: ListShippingRatesQuery,
  ): Promise<ListableShippingRateDto[]> {
    const customer: Customer = await this.customerRepository.findOne(
      query.customerId,
    );

    return (await customer.shippingRates).map((shippingRate: ShippingRate) => {
      return plainToClass(ListableShippingRateDto, shippingRate);
    });
  }
}
