import { NewPurchaseDto } from '../../../dtos/write/purchase/new-purchase.dto';

export class MakePurchaseCommand {
  constructor(public readonly newPurchase: NewPurchaseDto) {}
}
