import { StockUnit } from './stock-unit';

export class Stock {
  public available: number;
  public unit: StockUnit;

  public static create(available: number, unit: StockUnit): Stock {
    const stock: Stock = new Stock();
    stock.available = available;
    stock.unit = unit;

    return stock;
  }
}
