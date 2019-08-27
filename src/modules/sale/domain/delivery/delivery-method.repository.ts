import { DeliveryMethod } from './delivery-method';
import { Uuid } from '../../../common/uuid';

export abstract class DeliveryMethodRepository {
  public abstract async findOne(id: Uuid): Promise<undefined | DeliveryMethod>;
  public abstract async findOne(
    name: string,
  ): Promise<undefined | DeliveryMethod>;
  public abstract async save(
    deliveryMethod: DeliveryMethod,
  ): Promise<DeliveryMethod>;
  public abstract async find(): Promise<DeliveryMethod[]>;
  public abstract async delete(id: Uuid): Promise<void>;
}
