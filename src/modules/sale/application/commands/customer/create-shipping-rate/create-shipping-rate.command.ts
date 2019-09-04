import { Uuid } from '../../../../../common/uuid';
import { NewShippingRateDto } from '../../../dtos/write/shipping-rate/new-shipping-rate.dto';

export class CreateShippingRateCommand {
  constructor(
    public readonly customerId: Uuid,
    public readonly newShippingRate: NewShippingRateDto,
  ) {}
}
