import { OfferDescriptionItemType } from './offer-description-item-type';

export class DescriptionItemImage {
  public type: OfferDescriptionItemType;
  public url: string;

  public static create(
    type: OfferDescriptionItemType,
    url: string,
  ): DescriptionItemImage {
    const descriptionItem: DescriptionItemImage = new DescriptionItemImage();
    descriptionItem.type = type;
    descriptionItem.url = url;
    return descriptionItem;
  }
}
