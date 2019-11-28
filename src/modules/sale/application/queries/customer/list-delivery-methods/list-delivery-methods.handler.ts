import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListDeliveryMethodsQuery } from './list-delivery-methods.query';
import { DeliveryMethodRepository } from '../../../../domain/delivery/delivery-method.repository';
import { DeliveryMethod } from '../../../../domain/delivery/delivery-method';
import { plainToClass } from 'class-transformer';
import { ListableDeliveryMethodDto } from '../../../dtos/read/listable-delivery-method.dto';

@QueryHandler(ListDeliveryMethodsQuery)
export class ListDeliveryMethodsHandler
  implements IQueryHandler<ListDeliveryMethodsQuery> {
  constructor(
    private readonly deliveryMethodRepository: DeliveryMethodRepository,
  ) {}

  public async execute(
    query: ListDeliveryMethodsQuery,
  ): Promise<ListableDeliveryMethodDto[]> {
    const deliveryMethods: DeliveryMethod[] = await this.deliveryMethodRepository.find();
    return deliveryMethods.map((deliveryMethod: DeliveryMethod) =>
      plainToClass(ListableDeliveryMethodDto, deliveryMethod),
    );
  }
}
