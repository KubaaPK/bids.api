import { Injectable } from '@nestjs/common';
import { Parameter } from '../../../domain/category/parameter';
import { Restrictions } from '../../../domain/category/restrictions';
import { ParameterType } from '../../../domain/category/parameter-type.enum';

@Injectable()
export class ParameterValidator {
  public validate(value: any, parameter: Parameter): boolean {
    switch (parameter.type) {
      case ParameterType.INTEGER:
        return this.validateInteger(value, parameter.restrictions);
      case ParameterType.SINGLE_STRING:
        return this.validateSingleString(value, parameter.restrictions);
      case ParameterType.FLOAT:
        return this.validateFloat(value, parameter.restrictions);
      default:
        return false;
    }
  }

  private validateInteger(value: any, restrictions: Restrictions): boolean {
    const { min, max } = restrictions;
    const parsedValue: number = Number.parseInt(value, 10);
    return parsedValue >= min && parsedValue <= max;
  }

  private validateSingleString(value, restrictions: Restrictions): boolean {
    const { minLength, maxLength } = restrictions;
    return value.length >= minLength && value.length <= maxLength;
  }

  private validateFloat(value: any, restrictions: Restrictions): boolean {
    const { min, max, precision } = restrictions;
    const parsedValue: number = Number.parseFloat(value);
    const fixedValue: string =
      value.split('.')[1] === undefined ? parsedValue.toFixed(2) : value;
    if (parsedValue > max || parsedValue < min) {
      return false;
    }
    return fixedValue.split('.')[1].length === precision;
  }
}
