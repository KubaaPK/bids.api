import { DescriptionItemImage } from './description-item-image';
import { DescriptionItemText } from './description-item-text';

export class DescriptionSection {
  public readonly maxItemsPerSection: number = 2;
  public items: (DescriptionItemImage | DescriptionItemText)[] = [];

  public addItem(item: DescriptionItemImage | DescriptionItemText): void {
    if (this.items.length === this.maxItemsPerSection) {
      throw new Error('Maximum number of items per section reached.');
    }
    this.items.push(item);
  }

  public static create(): DescriptionSection {
    return new DescriptionSection();
  }
}
