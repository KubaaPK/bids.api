import { Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { ShippingRate } from './shipping-rate/shipping-rate';
import { ToManyShippingRatesDefinedException } from './exceptions/to-many-shipping-rates-defined.exception';
import { ShippingRateAlreadyExistsException } from './exceptions/shipping-rate-already-exists.exception';
import { Uuid } from '../../../common/uuid';
import { ShippingRateNotFoundException } from './exceptions/shipping-rate-not-found.exception';
import { UpdatedShippingRateDto } from '../../application/dtos/write/shipping-rate/updated-shipping-rate.dto';
import { Offer } from '../offer/offer';
import { UpdatedDraftOfferDto } from '../../application/dtos/write/offer/updated-draft-offer.dto';
import { NotFoundException } from '@nestjs/common';
import { DescriptionSection } from '../offer/description/description-section';
import { DescriptionItem } from '../../application/dtos/write/offer/offer-description.dto';
import { OfferDescriptionItemType } from '../offer/description/offer-description-item-type';
import { DescriptionItemText } from '../offer/description/description-item-text';
import { DescriptionItemImage } from '../offer/description/description-item-image';
import { OfferStatus } from '../offer/offer-status';
import { Purchase } from '../purchase/purchase';
import { Sale } from '../sale/sale';
import { Review } from '../../../reviews/domain/review';

@Entity('customers')
export class Customer {
  @PrimaryColumn('uuid')
  public id: Uuid;

  @OneToMany(type => ShippingRate, shippingRate => shippingRate.customer, {
    cascade: true,
  })
  public shippingRates: Promise<ShippingRate[]>;

  @OneToMany(type => Offer, offer => offer.customer, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  public offers: Promise<Offer[]>;

  @OneToMany(type => Purchase, purchase => purchase.buyer)
  public purchases: Promise<Purchase[]>;

  @OneToMany(type => Sale, sale => sale.seller)
  public sales: Promise<Sale[]>;

  constructor(id?: Uuid) {
    this.id = id;
  }

  public async createShippingRate(
    newShippingRate: ShippingRate,
  ): Promise<void> {
    const existingShippingRates: ShippingRate[] = await this.shippingRates;
    if (
      existingShippingRates.length ===
      ShippingRate.MAXIMUM_AMOUNT_OF_SHIPPING_RATES
    ) {
      throw new ToManyShippingRatesDefinedException();
    }

    existingShippingRates.map((shippingRate: ShippingRate) => {
      if (shippingRate.name === newShippingRate.name) {
        throw new ShippingRateAlreadyExistsException();
      }
    });
    existingShippingRates.push(newShippingRate);
  }

  public async deleteShippingRate(shippingRateId: Uuid): Promise<void> {
    const existingShippingRates: ShippingRate[] = await this.shippingRates;
    const shippingRateToDeleteIdx: number = existingShippingRates.findIndex(
      el => el.id === shippingRateId,
    );

    if (shippingRateToDeleteIdx === -1) {
      throw new ShippingRateNotFoundException();
    }

    existingShippingRates.splice(shippingRateToDeleteIdx, 1);
  }

  public async updateShippingRate(
    updatedShippingRate: UpdatedShippingRateDto,
  ): Promise<void> {
    const existingShippingRates: ShippingRate[] = await this.shippingRates;
    const shippingRateToUpdateIdx: number = existingShippingRates.findIndex(
      el => el.id === updatedShippingRate.id,
    );

    if (shippingRateToUpdateIdx === -1) {
      throw new ShippingRateNotFoundException();
    }

    existingShippingRates[shippingRateToUpdateIdx].name =
      updatedShippingRate.name;
    existingShippingRates[shippingRateToUpdateIdx].rates =
      updatedShippingRate.rates;
  }

  public async createDraftOffer(draftOffer: Offer): Promise<void> {
    (await this.offers).push(draftOffer);
  }

  public async updateDraftOffer(
    draftOfferId: Uuid,
    dto: UpdatedDraftOfferDto,
  ): Promise<void> {
    const existingOffers: Offer[] = await this.offers;
    const offerToUpdateIdx: number = existingOffers.findIndex(
      (el: Offer) => el.id === draftOfferId,
    );
    if (offerToUpdateIdx === -1) {
      throw new NotFoundException('Oferta o podanym ID nie istnieje.');
    }
    existingOffers[offerToUpdateIdx] = Object.assign(
      existingOffers[offerToUpdateIdx],
      {
        images: dto.images,
        // prettier-ignore
        description:
          dto.description !== undefined
            ? dto.description.sections.map((el: any) => {
              const section: DescriptionSection = DescriptionSection.create();
              const items: any = el.items.map((el: DescriptionItem) => {
                return el.type === OfferDescriptionItemType.TEXT
                  ? DescriptionItemText.create(el.type, el.content)
                  : DescriptionItemImage.create(el.type, el.url);
              });
              items.map(el => section.addItem(el));
              return section;
            })
            : existingOffers[offerToUpdateIdx].description,
        sellingMode: dto.sellingMode,
        parameters: dto.parameters,
        shippingRate: dto.shippingRate,
        ean: dto.ean,
        name: dto.name,
        category: dto.category,
      },
    );
  }

  public async listDraftOffers(
    offset: number = 0,
    limit?: number,
  ): Promise<Offer[]> {
    const existingOffers: Offer[] = await this.offers;
    return existingOffers
      .map((offer: Offer) =>
        offer.status === OfferStatus.IN_ACTIVE ? offer : null,
      )
      .splice(offset, limit !== undefined ? limit : existingOffers.length);
  }

  public async deleteDraftOffer(offerId: Uuid): Promise<void> {
    const existingOffers: Offer[] = await this.offers;
    const offerToDeleteIdx: number = existingOffers.findIndex(
      (offer: Offer) =>
        offer.status === OfferStatus.IN_ACTIVE && offer.id === offerId,
    );
    if (offerToDeleteIdx === -1) {
      throw new NotFoundException('Oferta o podanym ID nie istnieje.');
    }
    existingOffers.splice(offerToDeleteIdx, 1);
  }

  public async publishOffer(offerIndex: number): Promise<void> {
    const offers: Offer[] = await this.offers;
    offers[offerIndex].status = OfferStatus.ACTIVE;
  }

  public async listSales(): Promise<Sale[]> {
    return await this.sales;
  }

  public static create(id: Uuid): Customer {
    const customer: Customer = new Customer();
    customer.id = id;

    return customer;
  }
}
