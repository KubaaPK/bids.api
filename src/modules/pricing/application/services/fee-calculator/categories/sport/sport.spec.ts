import { BicyclesAndAccessories } from './bicycles-and-accessories';
import { GymAndFitness } from './gym-and-fitness';
import { SkatingSlackline } from './skating-slackline';
import {
  CalculatableOfferDto,
  CategoriesNames,
} from '../../../../dtos/write/calculatable-offer.dto';
import { SellingModeFormat } from '../../../../../../sale/domain/offer/selling-mode';

describe('Sport Strategies', () => {
  let bicyclesAndAccessories: BicyclesAndAccessories;
  let gymAndFitness: GymAndFitness;
  let skatingSlackline: SkatingSlackline;

  beforeEach(async () => {
    bicyclesAndAccessories = new BicyclesAndAccessories();
    gymAndFitness = new GymAndFitness();
    skatingSlackline = new SkatingSlackline();
  });

  describe('Bicycles And Accessories', () => {
    it('should properly calculate fee', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.BICYCLES_AND_ACCESSORIES,
        sellingMode: {
          format: SellingModeFormat.BUY_NOW,
          price: {
            amount: '120.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = bicyclesAndAccessories.calculate(
        calculatableOffer,
      );
      expect(result).toBe('10.80');
    });
  });
  describe('Gym and Fitness', () => {
    it('should properly calculate fee when price is under 150 zl', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.GYM_AND_FITNESS,
        sellingMode: {
          format: SellingModeFormat.BUY_NOW,
          price: {
            amount: '120.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = gymAndFitness.calculate(calculatableOffer);
      expect(result).toBe('9.60');
    });

    it('should properly calculate fee when price is above 150 zl', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.FEMALE_CLOTHING,
        sellingMode: {
          format: SellingModeFormat.BUY_NOW,
          price: {
            amount: '200.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = gymAndFitness.calculate(calculatableOffer);
      expect(result).toBe('22.00');
    });
  });
  describe('Skating, Slackline', () => {
    it('should properly calculate fee', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.SKATING_SLACKLINE,
        sellingMode: {
          format: SellingModeFormat.BUY_NOW,
          price: {
            amount: '100.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = skatingSlackline.calculate(calculatableOffer);
      expect(result).toBe('8.00');
    });
  });
});
