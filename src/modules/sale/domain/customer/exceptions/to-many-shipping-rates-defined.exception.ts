import { UnprocessableEntityException } from '@nestjs/common';

export class ToManyShippingRatesDefinedException extends UnprocessableEntityException {
  constructor() {
    super('Osiągnięto maksymalny limit zdefiniowanych cenników.');
  }
}
