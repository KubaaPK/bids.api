import { AccessoriesGsm } from './accessories-gsm';
import { Laptops } from './laptops';
import { Monitors } from './monitors';
import { Pcs } from './pcs';
import { PrintersAndScanners } from './printers-and-scanners';
import { Projectors } from './projectors';
import { Smartphones } from './smartphones';
import { Smartwatches } from './smartwatches';
import { Tablets } from './tablets';
import { Tvs } from './tvs';
import {
  CalculatableOfferDto,
  CategoriesNames,
} from '../../../../dtos/write/calculatable-offer.dto';
import { SellingModeFormat } from '../../../../../../sale/domain/offer/selling-mode';

describe('Electronics Strategies', () => {
  let accessoriesGsm: AccessoriesGsm;
  let laptops: Laptops;
  let monitors: Monitors;
  let pcs: Pcs;
  let printersAndScanners: PrintersAndScanners;
  let projectors: Projectors;
  let smartphones: Smartphones;
  let smartwatches: Smartwatches;
  let tablets: Tablets;
  let tvs: Tvs;

  beforeEach(async () => {
    accessoriesGsm = new AccessoriesGsm();
    laptops = new Laptops();
    monitors = new Monitors();
    pcs = new Pcs();
    printersAndScanners = new PrintersAndScanners();
    projectors = new Projectors();
    smartphones = new Smartphones();
    smartwatches = new Smartwatches();
    tablets = new Tablets();
    tvs = new Tvs();
  });

  describe('Accessories GSM', () => {
    it('should properly calculate fee if price is under 50zl', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.ACCESSORIES_GSM,
        sellingMode: {
          format: SellingModeFormat.BUY_NOW,
          price: {
            amount: '49.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = accessoriesGsm.calculate(calculatableOffer);
      expect(result).toBe('4.90');
    });
    it('should properly calculate fee if price is above 50zl', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.ACCESSORIES_GSM,
        sellingMode: {
          format: SellingModeFormat.BUY_NOW,
          price: {
            amount: '100.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = accessoriesGsm.calculate(calculatableOffer);
      expect(result).toBe('11.00');
    });
  });

  describe('Laptops', () => {
    it('should properly calculate fee if price is under 1000zl', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.LAPTOPS,
        sellingMode: {
          format: SellingModeFormat.BUY_NOW,
          price: {
            amount: '780.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = laptops.calculate(calculatableOffer);
      expect(result).toBe('15.60');
    });
    it('should properly calculate fee if price is above 1000 zl and under 2000 zl', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.LAPTOPS,
        sellingMode: {
          format: SellingModeFormat.BUY_NOW,
          price: {
            amount: '1780.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = laptops.calculate(calculatableOffer);
      expect(result).toBe('46.70');
    });
    it('should properly calculate fee if price is above 2000 zl', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.LAPTOPS,
        sellingMode: {
          format: SellingModeFormat.BUY_NOW,
          price: {
            amount: '2780.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = laptops.calculate(calculatableOffer);
      expect(result).toBe('57.80');
    });
  });

  describe('Monitors', () => {
    it('should properly calculate fee', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.MONITORS,
        sellingMode: {
          format: SellingModeFormat.BUY_NOW,
          price: {
            amount: '1000.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = monitors.calculate(calculatableOffer);
      expect(result).toBe('40.00');
    });
  });

  describe('Pcs', () => {
    it('should properly calculate fee if price is under 1000zl', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.PCS,
        sellingMode: {
          format: SellingModeFormat.BUY_NOW,
          price: {
            amount: '780.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = pcs.calculate(calculatableOffer);
      expect(result).toBe('15.60');
    });
    it('should properly calculate fee if price is above 1000 zl and under 2000 zl', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.PCS,
        sellingMode: {
          format: SellingModeFormat.BUY_NOW,
          price: {
            amount: '1780.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = pcs.calculate(calculatableOffer);
      expect(result).toBe('46.70');
    });
    it('should properly calculate fee if price is above 2000 zl', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.PCS,
        sellingMode: {
          format: SellingModeFormat.BUY_NOW,
          price: {
            amount: '2780.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = pcs.calculate(calculatableOffer);
      expect(result).toBe('57.80');
    });
  });

  describe('Printers and Scanners', () => {
    it('should properly calculate fee', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.PRINTERS_AND_SCANNERS,
        sellingMode: {
          format: SellingModeFormat.BUY_NOW,
          price: {
            amount: '1000.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = printersAndScanners.calculate(calculatableOffer);
      expect(result).toBe('40.00');
    });
  });

  describe('Projectors', () => {
    it('should properly calculate fee', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.PROJECTORS,
        sellingMode: {
          format: SellingModeFormat.BUY_NOW,
          price: {
            amount: '1000.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = projectors.calculate(calculatableOffer);
      expect(result).toBe('20.00');
    });
  });

  describe('Smartphones', () => {
    it('should properly calculate fee for buy out type', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.SMARTPHONES,
        sellingMode: {
          format: SellingModeFormat.BUY_NOW,
          price: {
            amount: '1000.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = smartphones.calculate(calculatableOffer);
      expect(result).toBe('45.00');
    });
    it('should properly calculate fee for auction type', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.SMARTPHONES,
        sellingMode: {
          format: SellingModeFormat.AUCTION,
          price: {
            amount: '0.00',
            currency: 'PLN',
          },
          startingPrice: {
            amount: '1000.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = smartphones.calculate(calculatableOffer);
      expect(result).toBe('65.00');
    });
  });

  describe('Smartwatches', () => {
    it('should properly calculate fee for buy out type', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.FRAGRANCES_FOR_MEN,
        sellingMode: {
          format: SellingModeFormat.BUY_NOW,
          price: {
            amount: '1000.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = smartwatches.calculate(calculatableOffer);
      expect(result).toBe('45.00');
    });
    it('should properly calculate fee for auction type', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.FRAGRANCES_FOR_MEN,
        sellingMode: {
          format: SellingModeFormat.AUCTION,
          startingPrice: {
            amount: '1000.00',
            currency: 'PLN',
          },
          price: {
            amount: '0.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = smartwatches.calculate(calculatableOffer);
      expect(result).toBe('65.00');
    });
  });

  describe('Tablets', () => {
    it('should properly calculate fee for buy out type', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.FRAGRANCES_FOR_MEN,
        sellingMode: {
          format: SellingModeFormat.BUY_NOW,
          price: {
            amount: '1000.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = tablets.calculate(calculatableOffer);
      expect(result).toBe('45.00');
    });
    it('should properly calculate fee for auction type', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.FRAGRANCES_FOR_MEN,
        sellingMode: {
          format: SellingModeFormat.AUCTION,
          startingPrice: {
            amount: '1000.00',
            currency: 'PLN',
          },
          price: {
            amount: '0.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = tablets.calculate(calculatableOffer);
      expect(result).toBe('65.00');
    });
  });

  describe('Tvs', () => {
    it('should properly calculate fee for buy out type', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.FRAGRANCES_FOR_MEN,
        sellingMode: {
          format: SellingModeFormat.BUY_NOW,
          price: {
            amount: '1000.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = tvs.calculate(calculatableOffer);
      expect(result).toBe('20.00');
    });
    it('should properly calculate fee for auction type', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.FRAGRANCES_FOR_MEN,
        sellingMode: {
          format: SellingModeFormat.AUCTION,
          startingPrice: {
            amount: '1000.00',
            currency: 'PLN',
          },
          price: {
            amount: '0.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = tvs.calculate(calculatableOffer);
      expect(result).toBe('25.00');
    });
  });
});
