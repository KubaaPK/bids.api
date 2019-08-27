import { Uuid } from '../../../../../common/uuid';

export class DeleteDeliveryMethodCommand {
  constructor(public readonly deliveryMethodId: Uuid) {}
}
