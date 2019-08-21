import { BadRequestException } from '@nestjs/common';

export class InvalidUuidFormatException extends BadRequestException {
  constructor() {
    super('ID nie jest poprawnym UUID w wersji 4.');
  }
}
