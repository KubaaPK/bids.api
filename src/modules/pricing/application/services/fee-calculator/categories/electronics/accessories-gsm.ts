import { Calculatable } from '../../calculatable';
import { SellingModeFormat } from '../../../../../../sale/domain/offer/selling-mode';
import { CalculatableOfferDto } from '../../../../dtos/write/calculatable-offer.dto';

export class AccessoriesGsm implements Calculatable {
  private readonly to50zlPercentFee: number = 10;
  private readonly above50zlPercentFee: number = 6;
  private readonly above50zlFlatFee: number = 5;

  public calculate(calculatableOffer: CalculatableOfferDto): string {
    if (calculatableOffer.sellingMode.format === SellingModeFormat.BUY_NOW) {
      const price: number = Number.parseFloat(
        calculatableOffer.sellingMode.price.amount,
      );
      return price <= 50.0
        ? ((price * this.to50zlPercentFee) / 100).toFixed(2)
        : (
            this.above50zlFlatFee +
            (price * this.above50zlPercentFee) / 100
          ).toFixed(2);
    }

    const price: number = Number.parseFloat(
      calculatableOffer.sellingMode.startingPrice.amount,
    );
    return price <= 50.0
      ? ((price * this.to50zlPercentFee) / 100).toFixed(2)
      : (
          this.above50zlFlatFee +
          (price * this.above50zlPercentFee) / 100
        ).toFixed(2);
  }
}
