import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  TableInheritance,
} from 'typeorm';
import { Uuid } from '../../common/uuid';
import { AccountType } from './account-type.enum';
import { NewAccountDto } from '../application/dtos/write/new-account.dto';

@Entity('accounts')
export class Account {
  @PrimaryColumn('uuid')
  public id: Uuid;

  @Column({
    nullable: false,
    unique: true,
  })
  public username: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: AccountType,
  })
  public type: AccountType;

  @Column({
    nullable: true,
  })
  public nip?: number;

  @CreateDateColumn()
  public createdAt: Date;

  public static create(dto: NewAccountDto): Account {
    const account: Account = new Account();
    account.id = dto.id;
    account.username = dto.username;
    account.type = dto.type;
    account.nip = dto.nip;
    return account;
  }
}
