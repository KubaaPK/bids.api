import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListPurchasesToEvaluateQuery } from './list-purchases-to-evaluate.query';
import { CustomerRepository } from '../../../../sale/domain/customer/customer.repository';
import { Customer } from '../../../../sale/domain/customer/customer';
import { ListableReviewRequestDto } from '../../dtos/read/review-request/listable-review-request.dto';
import { ReviewRequest } from '../../../domain/review-request';
import { plainToClass } from 'class-transformer';
import { Offer } from '../../../../sale/domain/offer/offer';

@QueryHandler(ListPurchasesToEvaluateQuery)
export class ListPurchasesToEvaluateHandler
  implements IQueryHandler<ListPurchasesToEvaluateQuery> {
  constructor(private readonly customerRepository: CustomerRepository) {}

  public async execute(
    query: ListPurchasesToEvaluateQuery,
  ): Promise<ListableReviewRequestDto[]> {
    const customer: Customer = await this.customerRepository.findOne(
      query.customerId,
    );
    const reviewRequests: ReviewRequest[] = await customer.listReviewRequests();
    await this.resolveLazyPromises(reviewRequests);

    return reviewRequests.map((request: ReviewRequest) =>
      plainToClass(ListableReviewRequestDto, request),
    );
  }

  private async resolveLazyPromises(
    reviewRequest: ReviewRequest[],
  ): Promise<void> {
    for (let i = 0; i < reviewRequest.length; i += 1) {
      await reviewRequest[i].purchase;
      await (await reviewRequest[i].purchase).offer;
    }
  }
}
