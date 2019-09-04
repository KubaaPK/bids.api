import { Uuid } from '../../../../../common/uuid';

export class DeleteShippingRateCommand {
  constructor(
    public readonly customerId: Uuid,
    public readonly shippingRateId: Uuid,
  ) {}
}
