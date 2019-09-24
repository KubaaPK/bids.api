import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Uuid } from '../../../common/uuid';
import { Offer } from '../offer/offer';
import { Customer } from '../customer/customer';
import { NewPurchaseDto } from '../../application/dtos/write/purchase/new-purchase.dto';

@Entity('purchases')
export class Purchase {
  @PrimaryColumn('uuid')
  public id: Uuid;

  @ManyToOne(type => Offer, offer => offer.purchases)
  public offer: Promise<Offer>;

  @ManyToOne(type => Customer, customer => customer.purchases)
  public buyer: Customer;

  @Column({
    nullable: false,
  })
  public amount: number;

  @CreateDateColumn()
  public createdAt: Date;

  constructor(id?: Uuid) {
    this.id = id;
  }

  public static create(dto: NewPurchaseDto): Purchase {
    const purchase: Purchase = new Purchase();
    purchase.id = dto.id;
    purchase.amount = dto.amount;
    purchase.offer = Promise.resolve(new Offer(dto.offerId));
    purchase.buyer = new Customer(dto.buyerId);
    return purchase;
  }
}
