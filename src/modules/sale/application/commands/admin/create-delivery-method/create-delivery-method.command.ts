import { NewDeliveryMethodDto } from '../../../dtos/write/new-delivery-method.dto';

export class CreateDeliveryMethodCommand {
  constructor(public readonly newDeliveryMethod: NewDeliveryMethodDto) {}
}
