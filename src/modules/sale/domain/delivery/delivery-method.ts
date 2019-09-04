import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Uuid } from '../../../common/uuid';
import { PaymentPolicy } from './payment-policy.enum';
import { NewDeliveryMethodDto } from '../../application/dtos/write/delivery-method/new-delivery-method.dto';
import { UpdatedDeliveryMethodDto } from '../../application/dtos/write/delivery-method/updated-delivery-method.dto';

@Entity('delivery_methods')
export class DeliveryMethod {
  @PrimaryColumn('uuid')
  public id: Uuid;

  @Column({
    nullable: false,
  })
  public name: string;

  @Column({
    nullable: false,
    enum: PaymentPolicy,
  })
  public paymentPolicy: PaymentPolicy;

  public update(dto: UpdatedDeliveryMethodDto): void {
    this.name = dto.name;
    this.paymentPolicy = dto.paymentPolicy;
  }

  public static create(dto: NewDeliveryMethodDto): DeliveryMethod {
    const deliveryMethod: DeliveryMethod = new DeliveryMethod();

    deliveryMethod.id = dto.id;
    deliveryMethod.paymentPolicy = dto.paymentPolicy;
    deliveryMethod.name = dto.name;

    return deliveryMethod;
  }
}
