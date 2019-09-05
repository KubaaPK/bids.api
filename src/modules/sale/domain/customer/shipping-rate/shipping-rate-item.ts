import { Uuid } from '../../../../common/uuid';
import { ItemRate } from './item-rate';
import { ShippingRateItemDto } from '../../../application/dtos/write/shipping-rate/shipping-rate-item.dto';

export class ShippingRateItem {
  public deliveryMethod: {
    id: Uuid;
  };
  public maxQuantityPerPackage: number;
  public firstItemRate: ItemRate;
  public nextItemRate: ItemRate;

  public static create(dto: ShippingRateItemDto): ShippingRateItem {
    const newShippingRateItem: ShippingRateItem = new ShippingRateItem();
    newShippingRateItem.deliveryMethod = dto.deliveryMethod;
    newShippingRateItem.firstItemRate = dto.firstItemRate;
    newShippingRateItem.nextItemRate = dto.nextItemRate;
    newShippingRateItem.maxQuantityPerPackage = dto.maxQuantityPerPackage;

    return newShippingRateItem;
  }
}
