import { CalculatableOfferDto } from '../../dtos/write/calculatable-offer.dto';

export interface Calculatable {
  calculate(calculatableOffer: CalculatableOfferDto): string;
}
