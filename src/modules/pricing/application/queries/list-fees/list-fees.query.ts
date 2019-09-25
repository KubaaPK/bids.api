import { Uuid } from '../../../../common/uuid';
import { FeeStatus } from '../../../domain/fee/fee-status';

export class ListFeesQuery {
  constructor(
    public readonly debtorId: Uuid,
    public readonly status: FeeStatus = FeeStatus.UN_PAID,
  ) {}
}
