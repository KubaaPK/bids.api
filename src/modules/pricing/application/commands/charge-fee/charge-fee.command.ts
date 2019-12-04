import { Uuid } from '../../../../common/uuid';

export class ChargeFeeCommand {
  constructor(public readonly purchaseId: Uuid) {}
}
