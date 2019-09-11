import { UnprocessableEntityException } from '@nestjs/common';

export class InvalidParameterValueException extends UnprocessableEntityException {
  constructor(errors: string[]) {
    super(errors);
  }
}
