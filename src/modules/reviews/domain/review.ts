import { Uuid } from '../../common/uuid';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Customer } from '../../sale/domain/customer/customer';
import { Rating } from './rating';
import { Purchase } from '../../sale/domain/purchase/purchase';
import { RateType } from './rate-type';

@Entity('reviews')
export class Review {
  @PrimaryColumn('uuid')
  public id: Uuid;

  @Column({
    type: 'simple-json',
  })
  public rating: Rating;

  @ManyToOne(type => Customer, customer => customer.issuedRatings)
  public reviewer: Customer;

  @ManyToOne(type => Customer, customer => customer.receivedRatings)
  public seller: Customer;

  @OneToOne(() => Purchase)
  @JoinColumn()
  public purchase: Purchase;

  @Column({
    nullable: false,
    enum: RateType,
  })
  public rateType: RateType;

  public attachRating(rating: Rating): void {
    this.rating = rating;
  }

  public static create(
    id: Uuid,
    rateType: RateType,
    reviewerId: Uuid,
    sellerId: Uuid,
    purchaseId: Uuid,
  ): Review {
    const review: Review = new Review();
    review.id = id;
    review.reviewer = new Customer(reviewerId);
    review.seller = new Customer(sellerId);
    review.purchase = new Purchase(purchaseId);
    review.rateType = rateType;
    return review;
  }
}
