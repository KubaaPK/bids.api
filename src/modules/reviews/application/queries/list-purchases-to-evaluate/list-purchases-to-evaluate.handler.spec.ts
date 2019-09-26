import { ListPurchasesToEvaluateHandler } from './list-purchases-to-evaluate.handler';
import { CustomerRepository } from '../../../../sale/domain/customer/customer.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { ioCContainer } from '../../../../../config/ioc-container';
import { EntityManager } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { ListPurchasesToEvaluateQuery } from './list-purchases-to-evaluate.query';
import * as faker from 'faker';
import { Customer } from '../../../../sale/domain/customer/customer';
import { ReviewRequest } from '../../../domain/review-request';
import { ListableReviewRequestDto } from '../../dtos/read/review-request/listable-review-request.dto';
import { Purchase } from '../../../../sale/domain/purchase/purchase';
import { Offer } from '../../../../sale/domain/offer/offer';

describe('List Purchases To Evaluate Handler', () => {
  let handler: ListPurchasesToEvaluateHandler;
  let customerRepository: CustomerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListPurchasesToEvaluateHandler,
        ...ioCContainer,
        {
          provide: EntityManager,
          useValue: {
            getRepository: jest.fn().mockReturnThis(),
          },
        },
      ],
    }).compile();

    handler = module.get(ListPurchasesToEvaluateHandler);
    customerRepository = module.get(CustomerRepository);
  });

  it('should List Purchases To Evaluate Handler be defined', async () => {
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
      handler.execute(new ListPurchasesToEvaluateQuery(faker.random.uuid())),
    ).rejects.toThrowError(InternalServerErrorException);
  });

  it('should return an array with all remaining review requests', async () => {
    const reviewRequest: ReviewRequest = Object.assign(new ReviewRequest(), {
      purchase: new Promise(resolve =>
        resolve(
          Object.assign(new Purchase(), {
            offer: new Promise(resolve => resolve(new Offer())),
          }),
        ),
      ),
    });

    jest.spyOn(customerRepository, 'findOne').mockImplementationOnce(async () =>
      Object.assign(new Customer(), {
        reviewRequests: new Promise(resolve =>
          resolve([reviewRequest, reviewRequest]),
        ),
      }),
    );

    const reviewRequests: any[] = await handler.execute(
      new ListPurchasesToEvaluateQuery(faker.random.uuid()),
    );

    expect(Array.isArray(reviewRequests)).toBeTruthy();
  });

  it('should single array element be an instance of Listable Review Request Dto', async () => {
    const reviewRequest: ReviewRequest = Object.assign(new ReviewRequest(), {
      purchase: new Promise(resolve =>
        resolve(
          Object.assign(new Purchase(), {
            offer: new Promise(resolve => resolve(new Offer())),
          }),
        ),
      ),
    });

    jest.spyOn(customerRepository, 'findOne').mockImplementationOnce(async () =>
      Object.assign(new Customer(), {
        reviewRequests: new Promise(resolve =>
          resolve([reviewRequest, reviewRequest]),
        ),
      }),
    );

    const reviewRequests: ListableReviewRequestDto[] = await handler.execute(
      new ListPurchasesToEvaluateQuery(faker.random.uuid()),
    );

    expect(reviewRequests[0]).toBeInstanceOf(ListableReviewRequestDto);
  });
});
