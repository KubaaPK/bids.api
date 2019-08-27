import { NotFoundException } from '@nestjs/common';

export class DeliveryMethodNotFoundException extends NotFoundException {
  constructor() {
    super('Metoda dostawy od podanym id nie istnieje.');
  }
}
