import { Uuid } from '../../../../common/uuid';

export class ChargeFeeCommand {
  constructor(
    public readonly debtorId: Uuid,
    public readonly purchaseId: Uuid,
  ) {}
}
