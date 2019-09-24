import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Uuid } from '../../../common/uuid';
import { Customer } from '../../../sale/domain/customer/customer';
import { Purchase } from '../../../sale/domain/purchase/purchase';
import { FeeValue } from './fee-value';

@Entity('fees')
export class Fee {
  @PrimaryGeneratedColumn('uuid')
  public id: Uuid;

  @ManyToOne(() => Customer)
  public debtor: Customer;

  @OneToOne(() => Purchase)
  @JoinColumn({ name: 'purchaseId' })
  public purchase: Purchase;

  @Column({
    nullable: false,
    type: 'simple-json',
  })
  public fee: FeeValue;

  @CreateDateColumn()
  public createdAt;

  public addFee(fee: FeeValue): void {
    this.fee = fee;
  }

  public static create(debtorId: Uuid, purchaseId: Uuid): Fee {
    const fee: Fee = new Fee();
    fee.debtor = new Customer(debtorId);
    fee.purchase = new Purchase(purchaseId);
    return fee;
  }
}
