import { DescriptionItemImage } from './description-item-image';
import { DescriptionItemText } from './description-item-text';
import { UnprocessableEntityException } from '@nestjs/common';

export class DescriptionSection {
  public items: (DescriptionItemImage | DescriptionItemText)[] = [];

  public addItem(item: DescriptionItemImage | DescriptionItemText): void {
    if (this.items.length === 2) {
      throw new UnprocessableEntityException(
        'W jednej sekcji opisu może znajdować się maksymalnie 2 elementy.',
      );
    }
    this.items.push(item);
  }

  public static create(): DescriptionSection {
    return new DescriptionSection();
  }
}
