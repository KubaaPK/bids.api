import { Calculatable } from '../../calculatable';
import { SellingModeFormat } from '../../../../../../sale/domain/offer/selling-mode';
import { CalculatableOfferDto } from '../../../../dtos/write/calculatable-offer.dto';

export class Projectors implements Calculatable {
  private readonly percentFee: number = 2;

  public calculate(calculatableOffer: Partial<CalculatableOfferDto>): string {
    if (calculatableOffer.sellingMode.format === SellingModeFormat.BUY_NOW) {
      const price: number = Number.parseFloat(
        calculatableOffer.sellingMode.price.amount,
      );
      return ((price * this.percentFee) / 100).toFixed(2);
    }

    const price: number = Number.parseFloat(
      calculatableOffer.sellingMode.startingPrice.amount,
    );
    return ((price * this.percentFee) / 100).toFixed(2);
  }
}
