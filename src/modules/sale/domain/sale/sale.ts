import { Uuid } from '../../../common/uuid';
import { Customer } from '../customer/customer';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Purchase } from '../purchase/purchase';

@Entity('sales')
export class Sale {
  @PrimaryGeneratedColumn('uuid')
  public id: Uuid;

  @OneToOne(type => Purchase, { lazy: true })
  @JoinColumn()
  public purchase: Purchase;

  @ManyToOne(() => Customer, seller => seller.sales)
  public seller: Customer;

  @CreateDateColumn()
  public createdAt: Date;

  public static create(purchaseId: Uuid, sellerId: Uuid): Sale {
    const sold: Sale = new Sale();
    sold.seller = new Customer(sellerId);
    sold.purchase = new Purchase(purchaseId);
    return sold;
  }
}
