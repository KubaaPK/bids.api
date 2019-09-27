import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RatingsSummaryDto {
  @Expose()
  public readonly ratings: {
    complianceWithDescriptionAvg: number;
    customerServiceAvg: number;
    deliveryTimeAvg: number;
    shippingCostAvg: number;
  };

  @Expose()
  public readonly summary: {
    positives: number;
    negatives: number;
    positivesPercent: string;
  };
}
