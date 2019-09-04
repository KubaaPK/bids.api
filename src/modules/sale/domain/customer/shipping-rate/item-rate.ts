export class ItemRate {
  public readonly amount: string;
  public readonly currency: string;

  constructor(amount: string, currency: string) {
    this.amount = amount;
    this.currency = currency;
  }
}
