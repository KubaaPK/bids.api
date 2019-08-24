import { ConflictException } from '@nestjs/common';

export class ParameterAlreadyLinkedToCategoryException extends ConflictException {
  constructor() {
    super('Wybrana kategoria posiada już podany parametr.');
  }
}
