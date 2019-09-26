import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Uuid } from '../../common/uuid';
import { Purchase } from '../../sale/domain/purchase/purchase';
import { Customer } from '../../sale/domain/customer/customer';

@Entity('review_requests')
export class ReviewRequest {
  @PrimaryGeneratedColumn('uuid')
  public id: Uuid;

  @ManyToOne(() => Purchase, { lazy: true })
  public purchase: Purchase;

  @ManyToOne(() => Customer)
  public buyer: Customer;

  public static create(buyerId: Uuid, purchaseId: Uuid): ReviewRequest {
    const request: ReviewRequest = new ReviewRequest();
    request.buyer = new Customer(buyerId);
    request.purchase = new Purchase(purchaseId);

    return request;
  }
}
