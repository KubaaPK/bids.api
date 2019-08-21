import { NotFoundException } from '@nestjs/common';

export class CategoryNotFoundException extends NotFoundException {
  constructor() {
    super('Kategoria o podanym ID nie istnieje.');
  }
}
