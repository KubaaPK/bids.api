import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import * as flat from 'flat';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  public async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object: any = plainToClass(metatype, value);
    const errors: ValidationError[] = await validate(object, {
      whitelist: true,
      validationError: {
        target: false,
        value: false,
      },
    });

    if (errors.length > 0) {
      console.log(errors[0].children);
      throw new BadRequestException(this.formatErrorMessages(errors));
    }
    return value;
  }

  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private formatErrorMessages(errors: ValidationError[]): string[] {
    const flattenErrorsObject: string[] = Object.values(flat(errors));
    const elementsToUnFilter: any[] = [
      null,
      undefined,
      'parent',
      'id',
      'name',
      'type',
      'restrictions',
    ];
    return flattenErrorsObject
      .filter(el => !elementsToUnFilter.includes(el))
      .filter(el => el.length > 0);
  }
}
