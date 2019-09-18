import { Injectable } from '@nestjs/common';
import { Offer } from '../../../domain/offer/offer';
import { DescriptionSection } from '../../../domain/offer/description/description-section';
import { SellingMode } from '../../../domain/offer/selling-mode';
import { Stock } from '../../../domain/offer/stock';
import { Category } from '../../../domain/category/category';

@Injectable()
export class DraftOfferValidator {
  public validate(offer: Offer): string[] {
    const errors: string[] = [];

    errors.push(this.validateOfferName(offer.name));
    errors.push(this.validateOfferDescription(offer.description));
    errors.push(this.validateOfferSellingMode(offer.sellingMode));
    errors.push(this.validateOfferCategory(offer.category));
    errors.push(this.validateOfferImages(offer.images));
    errors.push(this.validateOfferStock(offer.stock));

    return !!errors.filter((error: string) => error !== undefined)
      ? errors.filter((error: string) => error !== undefined)
      : [];
  }

  private validateOfferName(name: string | null): string | undefined {
    if (name === undefined || name === null) {
      return 'Należy zdefiniować tytuł oferty.';
    }
  }

  private validateOfferDescription(
    description: DescriptionSection[] | null,
  ): string {
    switch (true) {
      case description === undefined || description === null:
        return 'Należy zdefiniować opis oferty.';
      case description!.length === 0:
        return 'Należy zdefiniować przynajmniej jedną sekcję opisu oferty.';
    }
  }

  private validateOfferCategory(category: Category): string {
    if (category === null || category === undefined) {
      return 'Należy zdefiniować kategorię oferty.';
    }
  }

  private validateOfferSellingMode(sellingMode: SellingMode | null): string {
    if (sellingMode === null || sellingMode === undefined) {
      return 'Należy zdefiniować tryb sprzedaży: typ oferty i ceny.';
    }
  }

  private validateOfferImages(images: string[]): string {
    if (
      images === null ||
      images === undefined ||
      (images && images.length === 0)
    ) {
      return 'Należy dodać co najmniej 1 obrazek do oferty.';
    }
  }

  private validateOfferStock(stock: Stock): string {
    if (stock === null || stock === undefined) {
      return 'Należy dodać informacje odnośnie ilości sprzedawanych przedmiotów.';
    }
  }
}
