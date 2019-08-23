import { NotFoundException } from '@nestjs/common';

export class ParameterNotFoundException extends NotFoundException {
  constructor() {
    super('Parametr o podanym ID nie istnieje.');
  }
}
