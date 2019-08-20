import { ConflictException } from '@nestjs/common';

export class CategoryAlreadyExistsException extends ConflictException {
  constructor() {
    super('Kategoria o podanej nazwie już istnieje.');
  }
}
