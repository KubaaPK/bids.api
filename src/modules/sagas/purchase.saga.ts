import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { PurchaseMadeEvent } from '../sale/application/events/purchase-made/purchase-made.event';
import { flatMap, map } from 'rxjs/operators';
import { ChargeFeeCommand } from '../pricing/application/commands/charge-fee/charge-fee.command';
import { UpdateOfferProductStockCommand } from '../sale/application/commands/customer/update-offer-product-stock/update-offer-product-stock.command';

@Injectable()
export class PurchaseSaga {
  // prettier-ignore
  @Saga()
  public productPurchased = (
    events$: Observable<any>,
  ): Observable<ICommand> => {
    return events$.pipe(
      ofType(PurchaseMadeEvent),
      map((event: PurchaseMadeEvent) => {
        return [
          new UpdateOfferProductStockCommand(event.offer, event.amount),
          new ChargeFeeCommand(event.buyerId, event.purchaseId),
        ];
      }),
      flatMap(c => c),
    );
  }
}
