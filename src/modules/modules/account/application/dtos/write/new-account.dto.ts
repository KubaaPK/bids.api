import { ApiModelProperty } from '@nestjs/swagger';
import { AccountType } from '../../../domain/account-type.enum';
import { Uuid } from '../../../../../common/uuid';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  MaxLength,
  MinLength,
} from 'class-validator';

export class NewAccountDto {
  public id: Uuid;

  @ApiModelProperty({
    type: String,
    example: 'john_doe_22',
    description: 'An account public username.',
    minLength: 6,
    required: true,
  })
  @MinLength(6, {
    message: 'Username must be at least 6 characters long.',
  })
  public readonly username: string;

  @ApiModelProperty({
    type: String,
    example: 'johndoe22@gmail.com',
    description: 'An account email address.',
    required: true,
  })
  @IsEmail(
    {},
    {
      message: 'Invalid email address.',
    },
  )
  public readonly email: string;

  @ApiModelProperty({
    type: String,
    example: '*******',
    description: 'An account password.',
    minLength: 6,
    required: true,
  })
  @MinLength(6, {
    message: 'Password must be at least 6 characters long.',
  })
  public readonly password: string;

  @ApiModelProperty({
    type: AccountType,
    enum: AccountType,
    example: `${AccountType.COMPANY}`,
    description: 'An account type.',
    required: true,
  })
  @IsEnum(AccountType, {
    message: `Invalid account type. Valid types: ${AccountType.PRIVATE} and ${
      AccountType.COMPANY
    }`,
  })
  public readonly type: AccountType;

  @ApiModelProperty({
    type: Number,
    example: `4165561211`,
    description: 'Company NIP number.',
    required: false,
  })
  @IsNumber(
    {},
    {
      message:
        'Adres NIP musi być podany w formie liczby bez znaków specjalnych.',
    },
  )
  @MinLength(10, {
    message: 'Adres NIP musi składać się z 10 cyfr bez znaków specjalnych.',
  })
  @MaxLength(10, {
    message: 'Adres NIP musi składać się z 10 cyfr bez znaków specjalnych.',
  })
  public readonly nip?: number;
}
