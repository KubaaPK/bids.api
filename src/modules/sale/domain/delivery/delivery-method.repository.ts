import { DeliveryMethod } from './delivery-method';

export abstract class DeliveryMethodRepository {
  public abstract async findOne(
    name: string,
  ): Promise<undefined | DeliveryMethod>;
  public abstract async save(
    deliveryMethod: DeliveryMethod,
  ): Promise<DeliveryMethod>;
}
