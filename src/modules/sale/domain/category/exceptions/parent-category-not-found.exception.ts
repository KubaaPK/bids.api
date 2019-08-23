import { NotFoundException } from '@nestjs/common';

export class ParentCategoryNotFoundException extends NotFoundException {
  constructor() {
    super('Nadrzędna kategoria o podanym id nie istnieje.');
  }
}
