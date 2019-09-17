import { CalculatableOfferDto } from '../../application/dtos/write/calculatable-offer.dto';
import { CalculatedFeeDto } from '../../application/dtos/read/calculated-fee.dto';

export abstract class FeeCalculator {
  public abstract calculate(
    calculatableOffer: CalculatableOfferDto,
  ): CalculatedFeeDto;
}
