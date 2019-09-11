import { Test, TestingModule } from '@nestjs/testing';
import { ParameterValidator } from './parameter-validator';
import { ParameterType } from '../../../domain/category/parameter-type.enum';
import { Parameter } from '../../../domain/category/parameter';

describe('Parameter Validator', () => {
  let parameterValidator: ParameterValidator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParameterValidator],
    }).compile();

    parameterValidator = module.get(ParameterValidator);
  });

  it('should Parameter Validator be defined', async () => {
    expect(parameterValidator).toBeDefined();
  });

  describe(`${ParameterType.INTEGER}`, () => {
    it('should return false if value is to small', async () => {
      const parameter: Parameter = {
        type: ParameterType.INTEGER,
        restrictions: {
          min: 10,
          max: 20,
        },
      } as Parameter;
      const value: string = '5';
      expect(parameterValidator.validate(value, parameter)).toBeFalsy();
    });

    it('should return false if value is to large', async () => {
      const parameter: Parameter = {
        type: ParameterType.INTEGER,
        restrictions: {
          min: 10,
          max: 20,
        },
      } as Parameter;
      const value: string = '25';
      expect(parameterValidator.validate(value, parameter)).toBeFalsy();
    });

    it('should return true if value is between min and max', async () => {
      const parameter: Parameter = {
        type: ParameterType.INTEGER,
        restrictions: {
          min: 10,
          max: 20,
        },
      } as Parameter;
      const value: string = '12';
      expect(parameterValidator.validate(value, parameter)).toBeTruthy();
    });

    it('should return true if value is equal to min', async () => {
      const parameter: Parameter = {
        type: ParameterType.INTEGER,
        restrictions: {
          min: 10,
          max: 20,
        },
      } as Parameter;
      const value: string = '10';
      expect(parameterValidator.validate(value, parameter)).toBeTruthy();
    });

    it('should return true if value is equal to max', async () => {
      const parameter: Parameter = {
        type: ParameterType.INTEGER,
        restrictions: {
          min: 10,
          max: 20,
        },
      } as Parameter;
      const value: string = '20';
      expect(parameterValidator.validate(value, parameter)).toBeTruthy();
    });
  });
  describe(`${ParameterType.SINGLE_STRING}`, () => {
    it('should return false if value to short', async () => {
      const parameter: Parameter = {
        type: ParameterType.SINGLE_STRING,
        restrictions: {
          minLength: 10,
          maxLength: 20,
        },
      } as Parameter;
      const value: any = 'string-is-to-long-string-is-to-long';

      expect(parameterValidator.validate(value, parameter)).toBeFalsy();
    });

    it('should return false if value to short', async () => {
      const parameter: Parameter = {
        type: ParameterType.SINGLE_STRING,
        restrictions: {
          minLength: 10,
          maxLength: 20,
        },
      } as Parameter;
      const value: any = 'to-short';

      expect(parameterValidator.validate(value, parameter)).toBeFalsy();
    });

    it('should return true if value has correct length', async () => {
      const parameter: Parameter = {
        type: ParameterType.SINGLE_STRING,
        restrictions: {
          minLength: 10,
          maxLength: 20,
        },
      } as Parameter;
      const value: any = 'correct-length';

      expect(parameterValidator.validate(value, parameter)).toBeTruthy();
    });

    it('should return true if value has exactly min length', async () => {
      const parameter: Parameter = {
        type: ParameterType.SINGLE_STRING,
        restrictions: {
          minLength: 10,
          maxLength: 20,
        },
      } as Parameter;
      const value: any = 'ten-length';

      expect(parameterValidator.validate(value, parameter)).toBeTruthy();
    });

    it('should return true if value has exactly max length', async () => {
      const parameter: Parameter = {
        type: ParameterType.SINGLE_STRING,
        restrictions: {
          minLength: 10,
          maxLength: 20,
        },
      } as Parameter;
      const value: any = 'twenty-length-------';

      expect(parameterValidator.validate(value, parameter)).toBeTruthy();
    });
  });
  describe(`${ParameterType.FLOAT}`, () => {
    it('should return false if value is to small', async () => {
      const parameter: Parameter = {
        type: ParameterType.FLOAT,
        restrictions: {
          min: 10,
          max: 20,
          precision: 2,
        },
      } as Parameter;
      const value: any = '5';

      expect(parameterValidator.validate(value, parameter)).toBeFalsy();
    });

    it('should return false if value is to large', async () => {
      const parameter: Parameter = {
        type: ParameterType.FLOAT,
        restrictions: {
          min: 10,
          max: 20,
          precision: 2,
        },
      } as Parameter;
      const value: any = '25';

      expect(parameterValidator.validate(value, parameter)).toBeFalsy();
    });

    it('should return false if precision number (fixed) is to big', async () => {
      const parameter: Parameter = {
        type: ParameterType.FLOAT,
        restrictions: {
          min: 10,
          max: 20,
          precision: 2,
        },
      } as Parameter;
      const value: any = '14.5231';

      expect(parameterValidator.validate(value, parameter)).toBeFalsy();
    });

    it('should return true if value is between min and max', async () => {
      const parameter: Parameter = {
        type: ParameterType.FLOAT,
        restrictions: {
          min: 10,
          max: 20,
          precision: 2,
        },
      } as Parameter;
      const value: any = '15';

      expect(parameterValidator.validate(value, parameter)).toBeTruthy();
    });

    it('should return true if value is exactly like min', async () => {
      const parameter: Parameter = {
        type: ParameterType.FLOAT,
        restrictions: {
          min: 10,
          max: 20,
          precision: 2,
        },
      } as Parameter;
      const value: any = '10';

      expect(parameterValidator.validate(value, parameter)).toBeTruthy();
    });

    it('should return true if value is exactly like max', async () => {
      const parameter: Parameter = {
        type: ParameterType.FLOAT,
        restrictions: {
          min: 10,
          max: 20,
          precision: 2,
        },
      } as Parameter;
      const value: any = '20';

      expect(parameterValidator.validate(value, parameter)).toBeTruthy();
    });

    it('should return true if value has proper fixed number', async () => {
      const parameter: Parameter = {
        type: ParameterType.FLOAT,
        restrictions: {
          min: 10,
          max: 20,
          precision: 2,
        },
      } as Parameter;
      const value: any = '14.25';

      expect(parameterValidator.validate(value, parameter)).toBeTruthy();
    });
  });
});
