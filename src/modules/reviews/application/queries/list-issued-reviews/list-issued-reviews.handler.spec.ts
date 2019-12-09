import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import * as faker from 'faker';
import { ListIssuedReviewsHandler } from './list-issued-reviews.handler';
import { ioCContainer } from '../../../../../config/ioc-container';
import { ReviewRepository } from '../../../domain/review.repository';
import { ListIssuedReviewsQuery } from './list-issued-reviews.query';
import { Review } from '../../../domain/review';
import { ListableIssuedReviewDto } from '../../dtos/read/issued-reviews/listable-issued-review.dto';
import { Customer } from '../../../../sale/domain/customer/customer';

describe('List Issued Reviews Handler', () => {
  let handler: ListIssuedReviewsHandler;
  let reviewRepository: ReviewRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListIssuedReviewsHandler,
        ...ioCContainer,
        {
          provide: EntityManager,
          useValue: {
            getRepository: jest.fn().mockReturnThis(),
          },
        },
      ],
    }).compile();

    handler = module.get(ListIssuedReviewsHandler);
    reviewRepository = module.get(ReviewRepository);
  });

  it('should List Issued Reviews Handler be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should Review Repository be defined', () => {
    expect(reviewRepository).toBeDefined();
  });

  it('should throw Internal Server Error Exception if selecting reviews from Postgres fails', async () => {
    jest
      .spyOn(reviewRepository, 'findIssuedReviews')
      .mockImplementationOnce(() => {
        throw new InternalServerErrorException();
      });

    await expect(
      handler.execute(new ListIssuedReviewsQuery(faker.random.uuid())),
    ).rejects.toThrowError(InternalServerErrorException);
  });

  it('should return an array with issued reviews', async () => {
    const review: Review = Object.assign(new Review(), {
      id: faker.random.uuid(),
      seller: Object.assign(new Customer(), {
        id: faker.random.uuid(),
        username: faker.internet.userName(),
      }),
    });
    jest
      .spyOn(reviewRepository, 'findIssuedReviews')
      .mockImplementationOnce(async () => {
        return [review, review, review];
      });

    const result: any[] = await handler.execute(
      new ListIssuedReviewsQuery(faker.random.uuid()),
    );

    expect(Array.isArray(result)).toBeTruthy();
  });

  it('should single array element be an instance of ListableIssuedReviewDto', async () => {
    const review: Review = Object.assign(new Review(), {
      id: faker.random.uuid(),
      seller: Object.assign(new Customer(), {
        id: faker.random.uuid(),
        username: faker.internet.userName(),
      }),
    });
    jest
      .spyOn(reviewRepository, 'findIssuedReviews')
      .mockImplementationOnce(async () => {
        return [review, review, review];
      });

    const result: ListableIssuedReviewDto[] = await handler.execute(
      new ListIssuedReviewsQuery(faker.random.uuid()),
    );

    expect(result[0]).toBeInstanceOf(ListableIssuedReviewDto);
  });
});
