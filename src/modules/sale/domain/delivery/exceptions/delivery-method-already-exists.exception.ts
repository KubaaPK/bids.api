import { ConflictException } from '@nestjs/common';

export class DeliveryMethodAlreadyExistsException extends ConflictException {
  constructor() {
    super('Metoda dostawy o podanej nazwie i sposobie zapłaty już istnieje.');
  }
}
