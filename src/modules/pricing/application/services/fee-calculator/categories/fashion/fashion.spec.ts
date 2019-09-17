import { FemaleClothing } from './female-clothing';
import { FemaleJewelry } from './female-jewelry';
import { FemaleShoes } from './female-shoes';
import { FemaleWatches } from './female-watches';
import { MaleClothing } from './male-clothing';
import { MaleJewelry } from './male-jewelry';
import { MaleShoes } from './male-shoes';
import { MaleWatches } from './male-watches';
import {
  CalculatableOfferDto,
  CategoriesNames,
} from '../../../../dtos/write/calculatable-offer.dto';
import { SellingModeFormat } from '../../../../../../sale/domain/offer/selling-mode';

describe('Fashion Strategies', () => {
  let femaleClothing: FemaleClothing;
  let femaleJewelry: FemaleJewelry;
  let femaleShoes: FemaleShoes;
  let femaleWatches: FemaleWatches;
  let maleClothing: MaleClothing;
  let maleJewelry: MaleJewelry;
  let maleShoes: MaleShoes;
  let maleWatches: MaleWatches;

  beforeEach(async () => {
    femaleClothing = new FemaleClothing();
    femaleJewelry = new FemaleJewelry();
    femaleShoes = new FemaleShoes();
    femaleWatches = new FemaleWatches();
    maleClothing = new MaleClothing();
    maleJewelry = new MaleJewelry();
    maleShoes = new MaleShoes();
    maleWatches = new MaleWatches();
  });

  describe('Female Clothing', () => {
    it('should properly calculate fee', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.FEMALE_CLOTHING,
        sellingMode: {
          format: SellingModeFormat.BUY_NOW,
          price: {
            amount: '120.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = femaleClothing.calculate(calculatableOffer);
      expect(result).toBe('12.00');
    });
  });
  describe('Female Jewelry', () => {
    it('should properly calculate fee', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.FEMALE_JEWELRY,
        sellingMode: {
          format: SellingModeFormat.BUY_NOW,
          price: {
            amount: '120.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = femaleJewelry.calculate(calculatableOffer);
      expect(result).toBe('12.00');
    });
  });
  describe('Female Shoes', () => {
    it('should properly calculate fee', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.FEMALE_SHOES,
        sellingMode: {
          format: SellingModeFormat.BUY_NOW,
          price: {
            amount: '120.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = femaleShoes.calculate(calculatableOffer);
      expect(result).toBe('12.00');
    });
  });
  describe('Male Clothing', () => {
    it('should properly calculate fee', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.MALE_CLOTHING,
        sellingMode: {
          format: SellingModeFormat.BUY_NOW,
          price: {
            amount: '120.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = maleClothing.calculate(calculatableOffer);
      expect(result).toBe('12.00');
    });
  });
  describe('Male Jewelry', () => {
    it('should properly calculate fee', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.MALE_JEWELRY,
        sellingMode: {
          format: SellingModeFormat.BUY_NOW,
          price: {
            amount: '120.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = maleJewelry.calculate(calculatableOffer);
      expect(result).toBe('12.00');
    });
  });
  describe('Male Shoes', () => {
    it('should properly calculate fee', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.MALE_SHOES,
        sellingMode: {
          format: SellingModeFormat.BUY_NOW,
          price: {
            amount: '120.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = maleShoes.calculate(calculatableOffer);
      expect(result).toBe('12.00');
    });
  });
  describe('Female Watches', () => {
    it('should properly calculate fee if price is under 200 zl', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.FEMALE_WATCHES,
        sellingMode: {
          format: SellingModeFormat.BUY_NOW,
          price: {
            amount: '120.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = femaleWatches.calculate(calculatableOffer);
      expect(result).toBe('12.00');
    });
    it('should properly calculate fee if price is above 200 zl', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.FEMALE_WATCHES,
        sellingMode: {
          format: SellingModeFormat.BUY_NOW,
          price: {
            amount: '300.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = femaleWatches.calculate(calculatableOffer);
      expect(result).toBe('39.00');
    });
  });
  describe('Male Watches', () => {
    it('should properly calculate fee if price is under 200 zl', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.MALE_WATCHES,
        sellingMode: {
          format: SellingModeFormat.BUY_NOW,
          price: {
            amount: '120.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = femaleWatches.calculate(calculatableOffer);
      expect(result).toBe('12.00');
    });
    it('should properly calculate fee if price is above 200 zl', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.MALE_WATCHES,
        sellingMode: {
          format: SellingModeFormat.BUY_NOW,
          price: {
            amount: '300.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = femaleWatches.calculate(calculatableOffer);
      expect(result).toBe('39.00');
    });
  });
});
