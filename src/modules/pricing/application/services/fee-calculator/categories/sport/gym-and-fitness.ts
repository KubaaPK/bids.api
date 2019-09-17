import { Calculatable } from '../../calculatable';
import { CalculatableOfferDto } from '../../../../dtos/write/calculatable-offer.dto';
import { SellingModeFormat } from '../../../../../../sale/domain/offer/selling-mode';

export class GymAndFitness implements Calculatable {
  private readonly to150zlPercentFee: number = 8;
  private readonly above150zlPercentFee: number = 6;
  private readonly above150zlFlatFee: number = 10;

  public calculate(calculatableOffer: CalculatableOfferDto): string {
    if (calculatableOffer.sellingMode.format === SellingModeFormat.BUY_NOW) {
      const price: number = Number.parseFloat(
        calculatableOffer.sellingMode.price.amount,
      );
      switch (true) {
        case price <= 150:
          return ((price * this.to150zlPercentFee) / 100).toFixed(2);
        case price > 150:
          return (
            (price * this.above150zlPercentFee) / 100 +
            this.above150zlFlatFee
          ).toFixed(2);
      }
    }
    const price: number = Number.parseFloat(
      calculatableOffer.sellingMode.startingPrice.amount,
    );
    switch (true) {
      case price <= 150:
        return ((price * this.to150zlPercentFee) / 100).toFixed(2);
      case price > 150:
        return (
          (price * this.above150zlPercentFee) / 100 +
          this.above150zlFlatFee
        ).toFixed(2);
    }
  }
}
