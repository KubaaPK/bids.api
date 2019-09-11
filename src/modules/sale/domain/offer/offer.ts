import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Uuid } from '../../../common/uuid';
import { AggregateRoot } from '@nestjs/cqrs';
import { Category } from '../category/category';
import { SellingMode } from './selling-mode';
import { ShippingRate } from '../customer/shipping-rate/shipping-rate';
import { Customer } from '../customer/customer';
import { NewDraftOfferDto } from '../../application/dtos/write/offer/new-draft-offer.dto';
import { ParameterValue } from './parameter-value';
import { DescriptionSection } from './description/description-section';
import { OfferDescriptionItemType } from './description/offer-description-item-type';
import { DescriptionItemText } from './description/description-item-text';
import { DescriptionItemImage } from './description/description-item-image';
import {
  DescriptionItem,
  OfferDescriptionDto,
} from '../../application/dtos/write/offer/offer-description.dto';

@Entity('offers')
export class Offer extends AggregateRoot {
  @PrimaryColumn('uuid')
  public id: Uuid;

  @Column({
    nullable: false,
    length: 150,
  })
  public name: string;

  @Column({
    nullable: true,
  })
  public ean: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  public description: DescriptionSection[];

  @CreateDateColumn()
  public createdAt: Date;

  @ManyToOne(type => Category, category => category.offers)
  public category: Category;

  @Column({
    type: 'simple-json',
    nullable: true,
  })
  public sellingMode: SellingMode;

  @Column({
    type: 'simple-json',
    nullable: true,
  })
  public parameters: ParameterValue[];

  @ManyToOne(type => ShippingRate, shippingRate => shippingRate.offers)
  public shippingRate: ShippingRate;

  @ManyToOne(type => Customer, customer => customer.offers)
  public customer: Customer;

  public static create(dto: NewDraftOfferDto): Offer {
    const offer: Offer = new Offer();
    offer.id = dto.id;
    offer.name = dto.name;
    offer.category = dto.category;
    offer.customer = ({
      id: dto.customer.uid,
    } as unknown) as Customer;
    offer.parameters =
      dto.parameters !== undefined
        ? dto.parameters.map(el => ParameterValue.create(el.name, el.value))
        : null;
    offer.ean = dto.ean;
    offer.sellingMode = dto.sellingMode;
    offer.shippingRate = dto.shippingRate;
    offer.description = dto.description
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
      : null;
    return offer;
  }
}
