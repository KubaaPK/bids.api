import { Type } from '@nestjs/common';
import { AddReviewHandler } from './add-review/add-review.handler';
import { RequestAddReviewHandler } from './request-add-review/request-add-review.handler';

export const commandHandlers: Type<any>[] = [
  AddReviewHandler,
  RequestAddReviewHandler,
];
