import { Calculatable } from '../../calculatable';
import { SellingModeFormat } from '../../../../../../sale/domain/offer/selling-mode';
import { CalculatableOfferDto } from '../../../../dtos/write/calculatable-offer.dto';

export class PrintersAndScanners implements Calculatable {
  private readonly percentFee: number = 4;

  public calculate(calculatableOffer: CalculatableOfferDto): string {
    if (calculatableOffer.sellingMode.format === SellingModeFormat.BUY_NOW) {
      const price: number = Number.parseFloat(
        calculatableOffer.sellingMode.price.amount,
      );
      return ((price * this.percentFee) / 100).toFixed(2);
    }

    const price = Number.parseFloat(
      calculatableOffer.sellingMode.startingPrice.amount,
    );
    return ((price * this.percentFee) / 100).toFixed(2);
  }
}
