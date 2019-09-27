import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListSellerReviewsQuery } from './list-seller-reviews.query';
import { CustomerRepository } from '../../../../sale/domain/customer/customer.repository';
import { Customer } from '../../../../sale/domain/customer/customer';
import { Review } from '../../../domain/review';
import { RateType } from '../../../domain/rate-type';
import { plainToClass } from 'class-transformer';
import { RatingsSummaryDto } from '../../dtos/read/ratings-summary.dto';

@QueryHandler(ListSellerReviewsQuery)
export class ListSellerReviewsHandler
  implements IQueryHandler<ListSellerReviewsQuery> {
  constructor(private readonly customerRepository: CustomerRepository) {}

  public async execute(query: ListSellerReviewsQuery): Promise<any> {
    const seller: Customer = await this.customerRepository.findOne(
      query.sellerId,
    );

    const ratings: Review[] = await seller.receivedRatings;
    return plainToClass(RatingsSummaryDto, {
      ratings: this.calculateRatingsAvg(ratings),
      summary: this.calculateSummary(ratings),
    });
  }

  private calculateSummary(
    ratings: Review[],
  ): { positives: number; negatives: number; positivesPercent: string } {
    const ratingsTypes: RateType[] = ratings.map(el => el.rateType);

    const positives: number = ratingsTypes.filter(
      el => el === RateType.POSITIVE,
    ).length;
    const negatives: number = ratingsTypes.filter(
      el => el === RateType.NEGATIVE,
    ).length;

    return {
      positives,
      negatives,
      positivesPercent: `${Math.round(
        (positives / ratingsTypes.length) * 100,
      )}%`,
    };
  }

  private calculateRatingsAvg(rates: Review[]): any {
    const ratesLength: number = rates.length;

    const complianceWithDescriptionAvg: string = (
      rates.reduce(
        (total, current) => total + current.rating.complianceWithDescription,
        0,
      ) / ratesLength
    ).toPrecision(2);

    const customerServiceAvg: string = (
      rates.reduce(
        (total, current) => total + current.rating.customerService,
        0,
      ) / ratesLength
    ).toPrecision(2);
    const deliveryTimeAvg: string = (
      rates.reduce((total, current) => total + current.rating.deliveryTime, 0) /
      ratesLength
    ).toPrecision(2);
    const shippingCostAvg: string = (
      rates.reduce((total, current) => total + current.rating.shippingCost, 0) /
      ratesLength
    ).toPrecision(2);

    return {
      complianceWithDescriptionAvg: Number.parseFloat(
        complianceWithDescriptionAvg,
      ),
      customerServiceAvg: Number.parseFloat(customerServiceAvg),
      deliveryTimeAvg: Number.parseFloat(deliveryTimeAvg),
      shippingCostAvg: Number.parseFloat(shippingCostAvg),
    };
  }
}
