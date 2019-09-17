import { Calculatable } from '../../calculatable';
import { SellingModeFormat } from '../../../../../../sale/domain/offer/selling-mode';
import { CalculatableOfferDto } from '../../../../dtos/write/calculatable-offer.dto';

export class Laptops implements Calculatable {
  private readonly to1000zlPercentFee: number = 2;
  private readonly to2000zlPercentFee: number = 1.5;
  private readonly to2000zlFlatFee: number = 20;
  private readonly above2000zlPercentFee: number = 1;
  private readonly above2000zlFlatFee: number = 30;

  public calculate(calculatableOffer: CalculatableOfferDto): string {
    if (calculatableOffer.sellingMode.format === SellingModeFormat.BUY_NOW) {
      const price: number = Number.parseFloat(
        calculatableOffer.sellingMode.price.amount,
      );
      switch (true) {
        case price <= 1000:
          return ((price * this.to1000zlPercentFee) / 100).toFixed(2);
        case price > 1000 && price <= 2000:
          return (
            this.to2000zlFlatFee +
            (price * this.to2000zlPercentFee) / 100
          ).toFixed(2);
        case price > 2000:
          return (
            this.above2000zlFlatFee +
            (price * this.above2000zlPercentFee) / 100
          ).toFixed(2);
      }
    } else {
      const price: number = Number.parseFloat(
        calculatableOffer.sellingMode.startingPrice.amount,
      );
      switch (true) {
        case price <= 1000:
          return ((price * this.to1000zlPercentFee) / 100).toFixed(2);
        case price > 1000 && price <= 2000:
          return (
            this.to2000zlFlatFee +
            ((price * this.to2000zlPercentFee) / 100).toFixed(2)
          );
        case price > 2000:
          return (
            this.above2000zlFlatFee +
            ((price * this.above2000zlPercentFee) / 100).toFixed(2)
          );
      }
    }
  }
}
