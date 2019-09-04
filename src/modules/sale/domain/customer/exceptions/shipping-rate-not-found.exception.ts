import { NotFoundException } from '@nestjs/common';

export class ShippingRateNotFoundException extends NotFoundException {
  constructor() {
    super('Cennik o podanym ID nie istnieje.');
  }
}
