import { FragrancesForMen } from './fragrances-for-men';
import { FragrancesForWomen } from './fragrances-for-women';
import { Hairpaste } from './hairpaste';
import { Makeup } from './makeup';
import { Shaving } from './shaving';
import {
  CalculatableOfferDto,
  CategoriesNames,
} from '../../../../dtos/write/calculatable-offer.dto';
import { SellingModeFormat } from '../../../../../../sale/domain/offer/selling-mode';

describe('Category: Beauty Strategies', () => {
  let fragrancesForMen: FragrancesForMen;
  let fragrancesForWomen: FragrancesForWomen;
  let hairpaste: Hairpaste;
  let makeup: Makeup;
  let shaving: Shaving;

  beforeEach(async () => {
    fragrancesForMen = new FragrancesForMen();
    fragrancesForWomen = new FragrancesForWomen();
    hairpaste = new Hairpaste();
    makeup = new Makeup();
    shaving = new Shaving();
  });

  describe('Fragrance For Men', () => {
    it('should properly calculate fee', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.FRAGRANCES_FOR_MEN,
        sellingMode: {
          format: SellingModeFormat.BUY_NOW,
          price: {
            amount: '120.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = fragrancesForMen.calculate(calculatableOffer);
      expect(result).toBe('9.60');
    });

    it('should properly calculate fee if calculated fee is less than 1.00', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.FRAGRANCES_FOR_MEN,
        sellingMode: {
          format: SellingModeFormat.BUY_NOW,
          price: {
            amount: '1.20',
            currency: 'PLN',
          },
        },
      };

      const result: string = fragrancesForMen.calculate(calculatableOffer);
      expect(result).toBe('1.00');
    });
  });
  describe('Fragrance For Women', () => {
    it('should properly calculate fee', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.FRAGRANCES_FOR_MEN,
        sellingMode: {
          format: SellingModeFormat.BUY_NOW,
          price: {
            amount: '120.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = fragrancesForWomen.calculate(calculatableOffer);
      expect(result).toBe('9.60');
    });

    it('should properly calculate fee if calculated fee is less than 1.00', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.FRAGRANCES_FOR_MEN,
        sellingMode: {
          format: SellingModeFormat.BUY_NOW,
          price: {
            amount: '1.20',
            currency: 'PLN',
          },
        },
      };

      const result: string = fragrancesForWomen.calculate(calculatableOffer);
      expect(result).toBe('1.00');
    });
  });
  describe('Hairpaste', () => {
    it('should properly calculate fee', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.FRAGRANCES_FOR_MEN,
        sellingMode: {
          format: SellingModeFormat.BUY_NOW,
          price: {
            amount: '120.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = hairpaste.calculate(calculatableOffer);
      expect(result).toBe('12.00');
    });
  });
  describe('Makeup', () => {
    it('should properly calculate fee', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.FRAGRANCES_FOR_MEN,
        sellingMode: {
          format: SellingModeFormat.BUY_NOW,
          price: {
            amount: '120.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = makeup.calculate(calculatableOffer);
      expect(result).toBe('12.00');
    });
  });
  describe('Shaving', () => {
    it('should properly calculate fee', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.FRAGRANCES_FOR_MEN,
        sellingMode: {
          format: SellingModeFormat.BUY_NOW,
          price: {
            amount: '120.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = shaving.calculate(calculatableOffer);
      expect(result).toBe('12.00');
    });
  });
});
