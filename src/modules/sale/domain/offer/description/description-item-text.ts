import { OfferDescriptionItemType } from './offer-description-item-type';

export class DescriptionItemText {
  public type: OfferDescriptionItemType;
  public content: string;

  public static create(
    type: OfferDescriptionItemType,
    content: string,
  ): DescriptionItemText {
    const descriptionItem: DescriptionItemText = new DescriptionItemText();
    descriptionItem.type = type;
    descriptionItem.content = content;
    return descriptionItem;
  }
}
