import { Calculatable } from '../../calculatable';
import { CalculatableOfferDto } from '../../../../dtos/write/calculatable-offer.dto';
import { SellingModeFormat } from '../../../../../../sale/domain/offer/selling-mode';

export class FemaleWatches implements Calculatable {
  private readonly to200zlPercentFee: number = 10;
  private readonly above200zlPercentFee: number = 8;
  private readonly above200zlFlatFee: number = 15;

  public calculate(calculatableOffer: CalculatableOfferDto): string {
    if (calculatableOffer.sellingMode.format === SellingModeFormat.BUY_NOW) {
      const price: number = Number.parseFloat(
        calculatableOffer.sellingMode.price.amount,
      );
      switch (true) {
        case price <= 200:
          return ((price * this.to200zlPercentFee) / 100).toFixed(2);
        case price > 200:
          return (
            (price * this.above200zlPercentFee) / 100 +
            this.above200zlFlatFee
          ).toFixed(2);
      }
    }
  }
}
