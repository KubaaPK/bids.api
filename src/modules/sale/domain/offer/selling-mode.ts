import { CurrencyRate } from '../../../common/value-objects/currency-rate';
import { UnprocessableEntityException } from '@nestjs/common';

export enum SellingModeFormat {
  BUY_NOW = 'BUY_NOW',
  AUCTION = 'AUCTION',
}

export class SellingMode {
  public format: SellingModeFormat;
  public price: CurrencyRate;
  public minimalPrice?: CurrencyRate;
  public startingPrice?: CurrencyRate;

  public static create(
    format: SellingModeFormat,
    price: CurrencyRate,
    minimalPrice?: CurrencyRate,
    startingPrice?: CurrencyRate,
  ): SellingMode {
    const sellingMode: SellingMode = new SellingMode();

    if (format === SellingModeFormat.BUY_NOW) {
      sellingMode.format = format;
      sellingMode.price = {
        amount: price.amount,
        currency: price.currency,
      };
    } else {
      sellingMode.format = format;
      if (!minimalPrice || !startingPrice) {
        throw new UnprocessableEntityException(
          `W przypadku oferty typu: ${
            SellingModeFormat.AUCTION
          } należy zdefuniować cenę początkową i minimalną.`,
        );
      }
      sellingMode.minimalPrice = minimalPrice;
      sellingMode.startingPrice = startingPrice;
    }

    return sellingMode;
  }
}
