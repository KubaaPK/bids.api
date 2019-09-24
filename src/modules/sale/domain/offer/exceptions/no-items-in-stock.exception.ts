import { UnprocessableEntityException } from '@nestjs/common';

export class NoItemsInStockException extends UnprocessableEntityException {
  constructor(amountToBuy: number, currentlyInStock: number) {
    super(
      `Nie można kupić ${amountToBuy} przedmiotów, na stanie jest ich: ${currentlyInStock}.`,
    );
  }
}
