import { Uuid } from '../../../../../common/uuid';

export class SaveSaleCommand {
  constructor(
    public readonly sellerId: Uuid,
    public readonly purchaseId: Uuid,
  ) {}
}
