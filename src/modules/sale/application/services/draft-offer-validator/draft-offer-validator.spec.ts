import { DraftOfferValidator } from './draft-offer-validator';
import { Test, TestingModule } from '@nestjs/testing';
import { Offer } from '../../../domain/offer/offer';
import { OfferDescriptionItemType } from '../../../domain/offer/description/offer-description-item-type';
import { Category } from '../../../domain/category/category';
import * as faker from 'faker';
import { SellingModeFormat } from '../../../domain/offer/selling-mode';
import { StockUnit } from '../../../domain/offer/stock-unit';
import { ShippingRate } from '../../../domain/customer/shipping-rate/shipping-rate';

describe('Draft Item Validator', () => {
  let validator: DraftOfferValidator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DraftOfferValidator],
    }).compile();

    validator = module.get(DraftOfferValidator);
  });

  it('should Draft Item Validator be defined', async () => {
    expect(validator).toBeDefined();
  });

  it('should return array of strings with errors messages', async () => {
    const offerToValidate: Offer = {} as Offer;

    const result: string[] = await validator.validate(offerToValidate);

    expect(Array.isArray(result)).toBeTruthy();
  });

  it('should array contain error about no offer name', async () => {
    const offerToValidate: Offer = {
      name: null,
    } as Offer;

    const result: string[] = await validator.validate(offerToValidate);

    expect(result).toContain('Należy zdefiniować tytuł oferty.');
  });

  it('should array contain error about no offer description', async () => {
    const offerToValidate: Offer = {
      name: 'Tytul oferty',
      description: null,
    } as Offer;

    const result: string[] = await validator.validate(offerToValidate);

    expect(result).toContain('Należy zdefiniować opis oferty.');
  });

  it('should array contain error about no at least one description section provided', async () => {
    const offerToValidate: Offer = {
      name: 'Tytul oferty',
      description: [],
    } as Offer;

    const result: string[] = await validator.validate(offerToValidate);

    expect(result).toContain(
      'Należy zdefiniować przynajmniej jedną sekcję opisu oferty.',
    );
  });

  it('should array contain error about no offer category', async () => {
    const offerToValidate: Offer = {
      name: 'Tytul oferty',
      description: [
        {
          items: [{ content: 'Opis', type: OfferDescriptionItemType.TEXT }],
        },
      ],
      category: null,
    } as Offer;

    const result: string[] = await validator.validate(offerToValidate);

    expect(result).toContain('Należy zdefiniować kategorię oferty.');
  });

  it('should array contain error about no offer selling mode', async () => {
    const offerToValidate: Offer = {
      name: 'Tytul oferty',
      description: [
        {
          items: [{ content: 'Opis', type: OfferDescriptionItemType.TEXT }],
        },
      ],
      category: Object.assign(new Category(), {
        id: faker.random.uuid(),
      }) as Category,
      sellingMode: null,
    } as Offer;

    const result: string[] = await validator.validate(offerToValidate);

    expect(result).toContain(
      'Należy zdefiniować tryb sprzedaży: typ oferty i ceny.',
    );
  });

  it('should array contain error about no offer images', async () => {
    const offerToValidate: Offer = {
      name: 'Tytul oferty',
      description: [
        {
          items: [{ content: 'Opis', type: OfferDescriptionItemType.TEXT }],
        },
      ],
      category: Object.assign(new Category(), {
        id: faker.random.uuid(),
      }) as Category,
      sellingMode: {
        format: SellingModeFormat.BUY_NOW,
        price: {
          amount: '120.00',
          currency: 'PLN',
        },
      },
      images: null,
    } as Offer;

    const result: string[] = await validator.validate(offerToValidate);

    expect(result).toContain('Należy dodać co najmniej 1 obrazek do oferty.');
  });

  it('should array contain error about no offer stock information', async () => {
    const offerToValidate: Offer = {
      name: 'Tytul oferty',
      description: [
        {
          items: [{ content: 'Opis', type: OfferDescriptionItemType.TEXT }],
        },
      ],
      category: Object.assign(new Category(), {
        id: faker.random.uuid(),
      }) as Category,
      sellingMode: {
        format: SellingModeFormat.BUY_NOW,
        price: {
          amount: '120.00',
          currency: 'PLN',
        },
      },
      images: [faker.internet.url(), faker.internet.url()],
      stock: null,
    } as Offer;

    const result: string[] = await validator.validate(offerToValidate);

    expect(result).toContain(
      'Należy dodać informacje odnośnie ilości sprzedawanych przedmiotów.',
    );
  });

  it('should array contains all validator error messages', async () => {
    const errorMessages: string[] = [
      'Należy zdefiniować tytuł oferty.',
      'Należy zdefiniować opis oferty.',
      'Należy zdefiniować tryb sprzedaży: typ oferty i ceny.',
      'Należy zdefiniować kategorię oferty.',
      'Należy dodać cennik do oferty.',
      'Należy dodać co najmniej 1 obrazek do oferty.',
      'Należy dodać informacje odnośnie ilości sprzedawanych przedmiotów.',
    ];
    const offerToValidate: Offer = {
      name: null,
      description: null,
      stock: null,
      sellingMode: null,
      images: null,
    } as Offer;

    const result: string[] = await validator.validate(offerToValidate);

    result.map((el, idx) => expect(result).toContain(errorMessages[idx]));
  });

  it('should return empty errors array if offer is correct', async () => {
    const offerToValidate: Offer = ({
      name: 'Tytul oferty',
      description: [
        {
          items: [{ content: 'Opis', type: OfferDescriptionItemType.TEXT }],
        },
      ],
      category: new Promise(resolve =>
        resolve(
          Object.assign(new Category(), {
            id: faker.random.uuid(),
          }),
        ),
      ),
      shippingRate: new Promise(resolve =>
        resolve(
          Object.assign(new ShippingRate(), {
            id: faker.random.uuid(),
          }),
        ),
      ),
      sellingMode: {
        format: SellingModeFormat.BUY_NOW,
        price: {
          amount: '120.00',
          currency: 'PLN',
        },
      },
      images: [faker.internet.url(), faker.internet.url()],
      stock: {
        unit: StockUnit.UNIT,
        available: 1,
      },
    } as any) as Offer;

    const result: string[] = await validator.validate(offerToValidate);

    expect(result).toHaveLength(0);
  });
});
