import { Injectable } from '@nestjs/common';
import { FeeCalculator } from '../../../domain/fee/fee-calculator';
import {
  CalculatableOfferDto,
  CategoriesNames,
} from '../../dtos/write/calculatable-offer.dto';
import { Calculatable } from './calculatable';
import { CategoriesStrategiesMap } from './categories-strategies.map';
import { CalculatedFeeDto } from '../../dtos/read/calculated-fee.dto';

@Injectable()
export class FeeCalculatorStrategy implements FeeCalculator {
  private readonly strategies: Map<
    CategoriesNames,
    Calculatable
  > = CategoriesStrategiesMap.generate();

  public calculate(calculatableOffer: CalculatableOfferDto): CalculatedFeeDto {
    const fee: string = this.strategies
      .get(calculatableOffer.category)
      .calculate(calculatableOffer);
    return {
      amount: (
        Number.parseFloat(fee) * (calculatableOffer.amount || 1)
      ).toFixed(2),
      currency: 'PLN',
    };
  }
}
