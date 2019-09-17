import { GardeningTools } from './gardening-tools';
import { Irrigation } from './irrigation';
import { LampAccessories } from './lamp-accessories';
import { Lamps } from './lamps';
import { Plants } from './plants';
import { SawsAndChainsaws } from './saws-and-chainsaws';
import { Screwdrivers } from './screwdrivers';
import { Welders } from './welders';
import {
  CalculatableOfferDto,
  CategoriesNames,
} from '../../../../dtos/write/calculatable-offer.dto';
import { SellingModeFormat } from '../../../../../../sale/domain/offer/selling-mode';

describe('House and Garden Strategies', () => {
  let gardeningTools: GardeningTools;
  let irrigation: Irrigation;
  let lampAccessories: LampAccessories;
  let lamps: Lamps;
  let plants: Plants;
  let sawsAndChainsaws: SawsAndChainsaws;
  let screwdrivers: Screwdrivers;
  let welders: Welders;

  beforeEach(async () => {
    gardeningTools = new GardeningTools();
    irrigation = new Irrigation();
    lampAccessories = new LampAccessories();
    lamps = new Lamps();
    plants = new Plants();
    sawsAndChainsaws = new SawsAndChainsaws();
    screwdrivers = new Screwdrivers();
    welders = new Welders();
  });

  describe('Gardening Tools', () => {
    it('should properly calculate fee', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.GARDENING_TOOLS,
        sellingMode: {
          format: SellingModeFormat.BUY_NOW,
          price: {
            amount: '49.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = gardeningTools.calculate(calculatableOffer);
      expect(result).toBe('3.92');
    });
  });
  describe('Irrigation', () => {
    it('should properly calculate fee', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.DIETARY_SUPPLEMENTS,
        sellingMode: {
          format: SellingModeFormat.BUY_NOW,
          price: {
            amount: '49.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = irrigation.calculate(calculatableOffer);
      expect(result).toBe('2.45');
    });
  });
  describe('Lamp Accessories', () => {
    it('should properly calculate fee', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.LAMP_ACCESSORIES,
        sellingMode: {
          format: SellingModeFormat.BUY_NOW,
          price: {
            amount: '49.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = lampAccessories.calculate(calculatableOffer);
      expect(result).toBe('3.92');
    });
  });
  describe('Lamps', () => {
    it('should properly calculate fee', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.LAMPS,
        sellingMode: {
          format: SellingModeFormat.BUY_NOW,
          price: {
            amount: '49.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = lamps.calculate(calculatableOffer);
      expect(result).toBe('4.90');
    });
  });
  describe('Plants', () => {
    it('should properly calculate fee', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.PLANTS,
        sellingMode: {
          format: SellingModeFormat.BUY_NOW,
          price: {
            amount: '49.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = plants.calculate(calculatableOffer);
      expect(result).toBe('2.45');
    });
  });
  describe('Saws and Chainsaws', () => {
    it('should properly calculate fee', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.SAWS_AND_CHAINSAWS,
        sellingMode: {
          format: SellingModeFormat.BUY_NOW,
          price: {
            amount: '49.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = sawsAndChainsaws.calculate(calculatableOffer);
      expect(result).toBe('3.92');
    });
  });
  describe('Screwdrivers', () => {
    it('should properly calculate fee', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.SCREWDRIVERS,
        sellingMode: {
          format: SellingModeFormat.BUY_NOW,
          price: {
            amount: '49.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = screwdrivers.calculate(calculatableOffer);
      expect(result).toBe('3.92');
    });
  });
  describe('Welders', () => {
    it('should properly calculate fee', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.WELDERS,
        sellingMode: {
          format: SellingModeFormat.BUY_NOW,
          price: {
            amount: '49.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = welders.calculate(calculatableOffer);
      expect(result).toBe('3.92');
    });
  });
});
