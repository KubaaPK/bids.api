import { Books } from './books';
import { Games } from './games';
import { Movies } from './movies';
import { Music } from './music';
import {
  CalculatableOfferDto,
  CategoriesNames,
} from '../../../../dtos/write/calculatable-offer.dto';
import { SellingModeFormat } from '../../../../../../sale/domain/offer/selling-mode';

describe('Culture and Entertainment Strategies', () => {
  let books: Books;
  let games: Games;
  let movies: Movies;
  let music: Music;

  beforeEach(async () => {
    books = new Books();
    games = new Games();
    movies = new Movies();
    music = new Music();
  });

  describe('Books', () => {
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

      const result: string = books.calculate(calculatableOffer);
      expect(result).toBe('12.00');
    });
  });
  describe('Games', () => {
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

      const result: string = games.calculate(calculatableOffer);
      expect(result).toBe('9.60');
    });
    it('should properly calculate fee if fee is less than 1.00', async () => {
      const calculatableOffer: CalculatableOfferDto = {
        category: CategoriesNames.FRAGRANCES_FOR_MEN,
        sellingMode: {
          format: SellingModeFormat.BUY_NOW,
          price: {
            amount: '5.00',
            currency: 'PLN',
          },
        },
      };

      const result: string = games.calculate(calculatableOffer);
      expect(result).toBe('1.00');
    });
  });
  describe('Movies', () => {
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

      const result: string = movies.calculate(calculatableOffer);
      expect(result).toBe('12.00');
    });
  });
  describe('Music', () => {
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

      const result: string = music.calculate(calculatableOffer);
      expect(result).toBe('12.00');
    });
  });
});
