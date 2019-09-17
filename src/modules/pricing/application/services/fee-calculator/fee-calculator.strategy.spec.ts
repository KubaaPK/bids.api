import { Test, TestingModule } from '@nestjs/testing';
import { FeeCalculator } from '../../../domain/fee/fee-calculator';
import { FeeCalculatorStrategy } from './fee-calculator.strategy';
import {
  CalculatableOfferDto,
  CategoriesNames,
} from '../../dtos/write/calculatable-offer.dto';
import { SellingModeFormat } from '../../../../sale/domain/offer/selling-mode';
import { CalculatedFeeDto } from '../../dtos/read/calculated-fee.dto';

describe('Fee Calculator Strategy', () => {
  let feeCalculator: FeeCalculator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: FeeCalculator,
          useClass: FeeCalculatorStrategy,
        },
      ],
    }).compile();

    feeCalculator = module.get(FeeCalculator);
  });

  it('should Fee Calculator be defined', async () => {
    expect(feeCalculator).toBeDefined();
  });

  describe('calculate', () => {
    it(`should properly fee calculate for Gym and Fitness category`, async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.GYM_AND_FITNESS,
        sellingMode: {
          format: SellingModeFormat.BUY_NOW,
          price: {
            amount: '1490.00',
            currency: 'PLN',
          },
        },
      };

      const result: CalculatedFeeDto = feeCalculator.calculate(
        calculatableOffer,
      );
      expect(result).toEqual({
        currency: 'PLN',
        amount: '99.40',
      });
    });
  });
});
