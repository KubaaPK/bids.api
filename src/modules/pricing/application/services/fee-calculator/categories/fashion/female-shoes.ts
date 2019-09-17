import { Calculatable } from '../../calculatable';
import { CalculatableOfferDto } from '../../../../dtos/write/calculatable-offer.dto';
import { SellingModeFormat } from '../../../../../../sale/domain/offer/selling-mode';

export class FemaleShoes implements Calculatable {
  private readonly basicPercentFee: number = 10;

  public calculate(calculatableOffer: CalculatableOfferDto): string {
    if (calculatableOffer.sellingMode.format === SellingModeFormat.BUY_NOW) {
      const price: number = Number.parseFloat(
        calculatableOffer.sellingMode.price.amount,
      );
      return ((price * this.basicPercentFee) / 100).toFixed(2);
    }
    const price: number = Number.parseFloat(
      calculatableOffer.sellingMode.startingPrice.amount,
    );
    return ((price * this.basicPercentFee) / 100).toFixed(2);
  }
}
