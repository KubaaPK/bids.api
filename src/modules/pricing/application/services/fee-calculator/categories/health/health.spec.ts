import { BloodPressureMonitors } from './blood-pressure-monitors';
import { DietarySupplements } from './dietary-supplements';
import { ElectricBrushes } from './electric-brushes';
import { MassageEquipment } from './massage-equipment';
import { Rehabilitation } from './rehabilitation';
import { TeethWhitening } from './teeth-whitening';
import { Thermometers } from './thermometers';
import { Toothpastes } from './toothpastes';
import {
  CalculatableOfferDto,
  CategoriesNames,
} from '../../../../dtos/write/calculatable-offer.dto';
import { SellingModeFormat } from '../../../../../../sale/domain/offer/selling-mode';

describe('Health Strategies', () => {
  let bloodPressureMonitors: BloodPressureMonitors;
  let dietarySupplements: DietarySupplements;
  let electricBrushes: ElectricBrushes;
  let massageEquipment: MassageEquipment;
  let rehabilitation: Rehabilitation;
  let teethWhitening: TeethWhitening;
  let thermometers: Thermometers;
  let toothPastes: Toothpastes;

  beforeEach(async () => {
    bloodPressureMonitors = new BloodPressureMonitors();
    dietarySupplements = new DietarySupplements();
    electricBrushes = new ElectricBrushes();
    massageEquipment = new MassageEquipment();
    rehabilitation = new Rehabilitation();
    teethWhitening = new TeethWhitening();
    thermometers = new Thermometers();
    toothPastes = new Toothpastes();
  });

  describe('Blood Pressure Monitors', () => {
    it('should properly calculate fee', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.BLOOD_PRESSURE_MONITORS,
        sellingMode: {
          format: SellingModeFormat.BUY_NOW,
          price: {
            amount: '100.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = bloodPressureMonitors.calculate(calculatableOffer);
      expect(result).toBe('6.00');
    });
  });
  describe('Dietary Supplements', () => {
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

      const result: string = dietarySupplements.calculate(calculatableOffer);
      expect(result).toBe('4.90');
    });
  });
  describe('Electric Brushes', () => {
    it('should properly calculate fee', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.ELECTRIC_BRUSHES,
        sellingMode: {
          format: SellingModeFormat.BUY_NOW,
          price: {
            amount: '49.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = electricBrushes.calculate(calculatableOffer);
      expect(result).toBe('4.90');
    });
  });
  describe('Message Equipment', () => {
    it('should properly calculate fee', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.MASSAGE_EQUIPMENT,
        sellingMode: {
          format: SellingModeFormat.BUY_NOW,
          price: {
            amount: '490.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = massageEquipment.calculate(calculatableOffer);
      expect(result).toBe('49.00');
    });
  });
  describe('Rehabilitation', () => {
    it('should properly calculate fee', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.REHABILITATION,
        sellingMode: {
          format: SellingModeFormat.BUY_NOW,
          price: {
            amount: '49.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = rehabilitation.calculate(calculatableOffer);
      expect(result).toBe('4.90');
    });
  });
  describe('Teeth Whitening', () => {
    it('should properly calculate fee', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.TEETH_WHITENING,
        sellingMode: {
          format: SellingModeFormat.BUY_NOW,
          price: {
            amount: '49.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = teethWhitening.calculate(calculatableOffer);
      expect(result).toBe('4.90');
    });
  });
  describe('Thermometers', () => {
    it('should properly calculate fee', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.THERMOMETERS,
        sellingMode: {
          format: SellingModeFormat.BUY_NOW,
          price: {
            amount: '49.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = thermometers.calculate(calculatableOffer);
      expect(result).toBe('2.94');
    });
  });
  describe('Toothpastes', () => {
    it('should properly calculate fee', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.TOOTHPASTES,
        sellingMode: {
          format: SellingModeFormat.BUY_NOW,
          price: {
            amount: '49.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = toothPastes.calculate(calculatableOffer);
      expect(result).toBe('4.90');
    });
  });
});
