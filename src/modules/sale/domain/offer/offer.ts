import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Uuid } from '../../../common/uuid';
import { AggregateRoot } from '@nestjs/cqrs';
import { Category } from '../category/category';
import { SellingMode } from './selling-mode';
import { Parameter } from '../category/parameter';
import { ShippingRate } from '../customer/shipping-rate/shipping-rate';
import { Customer } from '../customer/customer';

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
  public description: string;

  @CreateDateColumn()
  public createdAt: Date;

  @ManyToOne(type => Category, category => category.offers)
  public category: Category;

  @Column({
    type: 'simple-json',
  })
  public sellingMode: SellingMode;

  @ManyToMany(type => Parameter, parameter => parameter.offers)
  public parameters: Promise<Parameter[]>;

  @ManyToOne(type => ShippingRate, shippingRate => shippingRate.offers)
  public shippingRate: ShippingRate;

  @ManyToOne(type => Customer, customer => customer.offers)
  public customer: Customer;
}
