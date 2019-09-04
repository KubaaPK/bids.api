import { ConflictException } from '@nestjs/common';

export class ShippingRateAlreadyExistsException extends ConflictException {
  constructor() {
    super('Cennik o podanej nazwie już istnieje.');
  }
}
