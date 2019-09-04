import { NotFoundException } from '@nestjs/common';

export class DeliveryMethodNotFoundException extends NotFoundException {
  constructor(message?: string) {
    message
      ? super(message)
      : super('Metoda dostawy od podanym id nie istnieje.');
  }
}
