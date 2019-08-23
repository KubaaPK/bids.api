import { BadRequestException } from '@nestjs/common';
import { ParameterType } from '../parameter-type.enum';

export class NoDictionarySpecifiedException extends BadRequestException {
  constructor() {
    super(
      `Parametr typu ${
        ParameterType.DICTIONARY
      } wymaga podania minimum jednego elementu w tablicy dictionary.`,
    );
  }
}
