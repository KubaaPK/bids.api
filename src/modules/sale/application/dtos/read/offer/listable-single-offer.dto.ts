import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { Uuid } from '../../../../../common/uuid';
import { Customer } from '../../../../domain/customer/customer';
import { ShippingRate } from '../../../../domain/customer/shipping-rate/shipping-rate';
import { SellingMode } from '../../../../domain/offer/selling-mode';
import { Stock } from '../../../../domain/offer/stock';
import { ListableOfferCategoryDto } from './listable-offer-category.dto';
import { ApiResponseModelProperty } from '@nestjs/swagger';
import { DescriptionSection } from '../../../../domain/offer/description/description-section';
import { ListableSingleOfferCategoryDto } from './listable-single-offer-category.dto';
import { ListableSingleOfferCustomerDto } from './listable-single-offer-customer.dto';

@Exclude()
export class ListableSingleOfferDto {
  @ApiResponseModelProperty({
    type: String,
    example: '83e88c71-47dc-4a25-85df-493b2dceb364',
  })
  @Expose()
  public readonly id: Uuid;

  @ApiResponseModelProperty({
    type: String,
    example: `Laptop Asus 15' Pentium N3710 4GB RAM 1TB HDD`,
  })
  @Expose()
  public readonly name: string;

  @Transform(value => JSON.parse(value))
  @Expose()
  public readonly description: DescriptionSection[];

  @ApiResponseModelProperty({
    type: ListableSingleOfferCustomerDto,
  })
  @Expose({ name: 'customer' })
  public readonly seller: ListableSingleOfferCustomerDto;

  @ApiResponseModelProperty({
    type: ShippingRate,
    example: {
      id: '005b32f4-8aed-4bc7-8888-b03f06cf3feb',
      name: 'Cennik dla elektroniki.',
      rates: [
        {
          deliveryMethod: {
            id: '0dc6d092-397a-4807-80c3-d025c1da54a7',
          },
          maxQuantityPerPackage: 100,
          firstItemRate: {
            amount: '100.00',
            currency: 'PLN',
          },
          nextItemRate: {
            amount: '100.00',
            currency: 'PLN',
          },
        },
      ],
    },
  })
  @Expose({ name: '__shippingRate__' })
  public readonly shippingRate: ShippingRate;

  @ApiResponseModelProperty({
    type: [String],
    example: [
      {
        url:
          'https://res.cloudinary.com/kubaapk/image/upload/v1568827872/dlknrxzdu595cgcirxjj.jpg',
      },
      {
        url:
          'https://res.cloudinary.com/kubaapk/image/upload/v1568827872/dlknrxzdu595cgcirxjj.jpg',
      },
      {
        url:
          'https://res.cloudinary.com/kubaapk/image/upload/v1568827872/dlknrxzdu595cgcirxjj.jpg',
      },
    ],
  })
  @Expose()
  @Transform((value: string[]) => {
    return value.map((url: string) => {
      return { url };
    });
  })
  public readonly images: string[];

  @ApiResponseModelProperty({
    example: {
      format: 'BUY_NOW',
      price: {
        amount: '10.50',
        currency: 'PLN',
      },
    },
  })
  @Expose()
  public readonly sellingMode: SellingMode;

  @ApiResponseModelProperty({
    example: {
      available: 1,
      unit: 'UNIT',
    },
  })
  @Expose()
  public readonly stock: Stock;

  @ApiResponseModelProperty({
    type: [ListableSingleOfferCategoryDto],
  })
  @Expose({ name: '__category__' })
  @Type(() => ListableSingleOfferCategoryDto)
  public readonly category: ListableSingleOfferCategoryDto;
}
