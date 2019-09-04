import { NewDeliveryMethodDto } from '../../../dtos/write/delivery-method/new-delivery-method.dto';

export class CreateDeliveryMethodCommand {
  constructor(public readonly newDeliveryMethod: NewDeliveryMethodDto) {}
}
