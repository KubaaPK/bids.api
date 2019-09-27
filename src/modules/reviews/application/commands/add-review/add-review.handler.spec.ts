import { AddReviewHandler } from './add-review.handler';
import { ReviewRepository } from '../../../domain/review.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { ioCContainer } from '../../../../../config/ioc-container';
import { EntityManager } from 'typeorm';
import { PurchaseRepository } from '../../../../sale/domain/purchase/purchase.repository';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { NewReviewDto } from '../../dtos/write/new-review.dto';
import * as faker from 'faker';
import { RateType } from '../../../domain/rate-type';
import { AddReviewCommand } from './add-review.command';
import { Purchase } from '../../../../sale/domain/purchase/purchase';
import { Customer } from '../../../../sale/domain/customer/customer';
import { Review } from '../../../domain/review';
import { Offer } from '../../../../sale/domain/offer/offer';

describe('Add Review Handler', () => {
  let handler: AddReviewHandler;
  let reviewRepository: ReviewRepository;
  let purchaseRepository: PurchaseRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddReviewHandler,
        ...ioCContainer,
        {
          provide: EntityManager,
          useValue: {
            getRepository: jest.fn().mockReturnThis(),
          },
        },
      ],
    }).compile();

    handler = module.get(AddReviewHandler);
    reviewRepository = module.get(ReviewRepository);
    purchaseRepository = module.get(PurchaseRepository);
  });

  it('should Add Review Handler be defined', async () => {
    expect(handler).toBeDefined();
  });

  it('should Review Repository be defined', async () => {
    expect(reviewRepository).toBeDefined();
  });

  it('should Purchase Repository be defined', async () => {
    expect(purchaseRepository).toBeDefined();
  });

  it('should throw Internal Server Error Exception if selecting purchase from Postgres fails', async () => {
    jest.spyOn(purchaseRepository, 'findOne').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    const newReview: NewReviewDto = {
      id: faker.random.uuid(),
      purchaseId: faker.random.uuid(),
      rateType: RateType.POSITIVE,
      rating: {
        complianceWithDescription: 5,
        customerService: 5,
        deliveryTime: 5,
        shippingCost: 5,
      },
      reviewerId: faker.random.uuid(),
    };

    await expect(
      handler.execute(new AddReviewCommand(newReview)),
    ).rejects.toThrowError(InternalServerErrorException);
  });

  it('should throw Not Found Exception if purchase not exists in Postgres', async () => {
    jest
      .spyOn(purchaseRepository, 'findOne')
      .mockImplementationOnce(() => undefined);

    const newReview: NewReviewDto = {
      id: faker.random.uuid(),
      purchaseId: faker.random.uuid(),
      rateType: RateType.POSITIVE,
      rating: {
        complianceWithDescription: 5,
        customerService: 5,
        deliveryTime: 5,
        shippingCost: 5,
      },
      reviewerId: faker.random.uuid(),
    };

    await expect(
      handler.execute(new AddReviewCommand(newReview)),
    ).rejects.toThrowError(NotFoundException);
  });

  it('should throw Unprocessable Entity Exception if reviewer is not an owner of the purchase', async () => {
    const purchaserId = faker.random.uuid();

    jest.spyOn(purchaseRepository, 'findOne').mockImplementationOnce(async () =>
      Object.assign(new Purchase(), {
        buyer: new Promise(resolve =>
          resolve(Object.assign(new Customer(), { id: purchaserId })),
        ),
      }),
    );

    const newReview: NewReviewDto = {
      id: faker.random.uuid(),
      purchaseId: faker.random.uuid(),
      rateType: RateType.POSITIVE,
      rating: {
        complianceWithDescription: 5,
        customerService: 5,
        deliveryTime: 5,
        shippingCost: 5,
      },
      reviewerId: faker.random.uuid(),
    };

    await expect(
      handler.execute(new AddReviewCommand(newReview)),
    ).rejects.toThrowError(UnprocessableEntityException);
  });

  it('should throw Internal Server Error Exception if selecting review from Postgres fails', async () => {
    const purchaserId = faker.random.uuid();

    jest.spyOn(purchaseRepository, 'findOne').mockImplementationOnce(async () =>
      Object.assign(new Purchase(), {
        buyer: new Promise(resolve =>
          resolve(Object.assign(new Customer(), { id: purchaserId })),
        ),
      }),
    );
    jest.spyOn(reviewRepository, 'findOne').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    const newReview: NewReviewDto = {
      id: faker.random.uuid(),
      purchaseId: faker.random.uuid(),
      rateType: RateType.POSITIVE,
      rating: {
        complianceWithDescription: 5,
        customerService: 5,
        deliveryTime: 5,
        shippingCost: 5,
      },
      reviewerId: purchaserId,
    };

    await expect(
      handler.execute(new AddReviewCommand(newReview)),
    ).rejects.toThrowError(InternalServerErrorException);
  });

  it('should throw Conflict Exception if there is already an review for given purchase', async () => {
    const purchaserId = faker.random.uuid();

    jest.spyOn(purchaseRepository, 'findOne').mockImplementationOnce(async () =>
      Object.assign(new Purchase(), {
        buyer: new Promise(resolve =>
          resolve(Object.assign(new Customer(), { id: purchaserId })),
        ),
      }),
    );
    jest
      .spyOn(reviewRepository, 'findOne')
      .mockImplementationOnce(async () => new Review());

    const newReview: NewReviewDto = {
      id: faker.random.uuid(),
      purchaseId: faker.random.uuid(),
      rateType: RateType.POSITIVE,
      rating: {
        complianceWithDescription: 5,
        customerService: 5,
        deliveryTime: 5,
        shippingCost: 5,
      },
      reviewerId: purchaserId,
    };

    await expect(
      handler.execute(new AddReviewCommand(newReview)),
    ).rejects.toThrowError(ConflictException);
  });

  it('should throw Internal Server Error if saving review to Postgres fails', async () => {
    const purchaserId = faker.random.uuid();

    jest.spyOn(purchaseRepository, 'findOne').mockImplementationOnce(async () =>
      Object.assign(new Purchase(), {
        offer: new Promise(resolve =>
          resolve(
            Object.assign(new Offer(), {
              customer: new Promise(resolve =>
                resolve(
                  Object.assign(new Customer(), { id: faker.random.uuid() }),
                ),
              ),
            }),
          ),
        ),
        buyer: new Promise(resolve =>
          resolve(Object.assign(new Customer(), { id: purchaserId })),
        ),
      }),
    );
    jest
      .spyOn(reviewRepository, 'findOne')
      .mockImplementationOnce(() => undefined);
    jest.spyOn(reviewRepository, 'save').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    const newReview: NewReviewDto = {
      id: faker.random.uuid(),
      purchaseId: faker.random.uuid(),
      rateType: RateType.POSITIVE,
      rating: {
        complianceWithDescription: 5,
        customerService: 5,
        deliveryTime: 5,
        shippingCost: 5,
      },
      reviewerId: purchaserId,
    };

    await expect(
      handler.execute(new AddReviewCommand(newReview)),
    ).rejects.toThrowError(InternalServerErrorException);
  });
});
