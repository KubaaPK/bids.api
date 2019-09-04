import { UnprocessableEntityException } from '@nestjs/common';

export class InvalidCurrencyCode extends UnprocessableEntityException {
  constructor() {
    super('Podany kod waluty nie jest zgodny z ISO-4217');
  }
}
