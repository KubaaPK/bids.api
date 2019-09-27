import { ListSellerReviewsHandler } from './list-seller-reviews.handler';
import { CustomerRepository } from '../../../../sale/domain/customer/customer.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { ioCContainer } from '../../../../../config/ioc-container';
import { EntityManager } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { ListSellerReviewsQuery } from './list-seller-reviews.query';
import * as faker from 'faker';
import { Customer } from '../../../../sale/domain/customer/customer';
import { Review } from '../../../domain/review';
import { RateType } from '../../../domain/rate-type';
import { RatingsSummaryDto } from '../../dtos/read/ratings-summary.dto';

describe('List Seller Reviews Handler', () => {
  let handler: ListSellerReviewsHandler;
  let customerRepository: CustomerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListSellerReviewsHandler,
        ...ioCContainer,
        {
          provide: EntityManager,
          useValue: {
            getRepository: jest.fn().mockReturnThis(),
          },
        },
      ],
    }).compile();

    handler = module.get(ListSellerReviewsHandler);
    customerRepository = module.get(CustomerRepository);
  });

  it('should List Seller Reviews Handler be defined', async () => {
    expect(handler).toBeDefined();
  });

  it('should Customer Repository be defined', async () => {
    expect(customerRepository).toBeDefined();
  });

  it('should throw Internal Server Error Exception if selecting customer from Postgres fails', async () => {
    jest.spyOn(customerRepository, 'findOne').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    await expect(
      handler.execute(new ListSellerReviewsQuery(faker.random.uuid())),
    ).rejects.toThrowError(InternalServerErrorException);
  });

  it('should return properly calculated rating summary for specific customer', async () => {
    const createReview = (
      complianceWithDescription: number,
      customerService: number,
      deliveryTime: number,
      shippingCost: number,
      rateType: RateType,
    ) => {
      return Object.assign(new Review(), {
        rateType,
        rating: {
          complianceWithDescription,
          customerService,
          deliveryTime,
          shippingCost,
        },
      });
    };

    jest.spyOn(customerRepository, 'findOne').mockImplementationOnce(async () =>
      Object.assign(new Customer(), {
        receivedRatings: new Promise(resolve =>
          resolve([
            createReview(5, 5, 5, 5, RateType.POSITIVE),
            createReview(3, 4, 4, 4, RateType.POSITIVE),
            createReview(1, 1, 2, 2, RateType.NEGATIVE),
          ]),
        ),
      }),
    );

    const summary: RatingsSummaryDto = await handler.execute(
      new ListSellerReviewsQuery(faker.random.uuid()),
    );

    expect(summary).toEqual({
      ratings: {
        complianceWithDescriptionAvg: 3,
        customerServiceAvg: 3.3,
        deliveryTimeAvg: 3.7,
        shippingCostAvg: 3.7,
      },
      summary: {
        positives: 2,
        negatives: 1,
        positivesPercent: '67%',
      },
    });
  });
});
