import { Uuid } from '../../../../../common/uuid';
import { UpdatedDeliveryMethodDto } from '../../../dtos/write/updated-delivery-method.dto';

export class UpdateDeliveryMethodCommand {
  constructor(
    public readonly deliveryMethodId: Uuid,
    public readonly updatedDeliveryMethod: UpdatedDeliveryMethodDto,
  ) {}
}
