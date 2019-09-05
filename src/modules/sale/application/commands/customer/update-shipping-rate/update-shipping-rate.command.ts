import { Uuid } from '../../../../../common/uuid';
import { UpdatedShippingRateDto } from '../../../dtos/write/shipping-rate/updated-shipping-rate.dto';

export class UpdateShippingRateCommand {
  constructor(
    public readonly customerId: Uuid,
    public readonly updatedShippingRate: UpdatedShippingRateDto,
  ) {}
}
