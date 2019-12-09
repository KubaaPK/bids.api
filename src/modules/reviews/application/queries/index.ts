import { Type } from '@nestjs/common';
import { ListPurchasesToEvaluateHandler } from './list-purchases-to-evaluate/list-purchases-to-evaluate.handler';
import { ListSellerReviewsHandler } from './list-seller-reviews/list-seller-reviews.handler';
import { ListIssuedReviewsHandler } from './list-issued-reviews/list-issued-reviews.handler';

export const queryHandlers: Type<any>[] = [
  ListPurchasesToEvaluateHandler,
  ListSellerReviewsHandler,
  ListIssuedReviewsHandler,
];
