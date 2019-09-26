import { IsNumber, Max, Min } from 'class-validator';

export class ReviewRatingDto {
  @IsNumber(
    {},
    {
      message: 'Ocena zgodności z opisem musi być liczbą z przedziału 1 - 5.',
    },
  )
  @Min(1, {
    message: 'Ocena zgodności z opisem musi być liczbą z przedziału 1 - 5',
  })
  @Max(5, {
    message: 'Ocena zgodności z opisem musi być liczbą z przedziału 1 - 5',
  })
  public readonly complianceWithDescription: number;

  @IsNumber(
    {},
    {
      message: 'Ocena obsługi klienta musi być liczbą z przedziału 1 - 5.',
    },
  )
  @Min(1, {
    message: 'Ocena obsługi klienta musi być liczbą z przedziału 1 - 5',
  })
  @Max(5, {
    message: 'Ocena obsługi klienta musi być liczbą z przedziału 1 - 5',
  })
  public readonly customerService: number;

  @IsNumber(
    {},
    {
      message: 'Ocena czasu wysyłki musi być liczbą z przedziału 1 - 5.',
    },
  )
  @Min(1, {
    message: 'Ocena czasu wysyłki musi być liczbą z przedziału 1 - 5',
  })
  @Max(5, {
    message: 'Ocena czasu wysyłki musi być liczbą z przedziału 1 - 5',
  })
  public readonly deliveryTime: number;

  @IsNumber(
    {},
    {
      message: 'Ocena kosztu wysyłki musi być liczbą z przedziału 1 - 5.',
    },
  )
  @Min(1, {
    message: 'Ocena kosztu wysyłki musi być liczbą z przedziału 1 - 5',
  })
  @Max(5, {
    message: 'Ocena kosztu wysyłki musi być liczbą z przedziału 1 - 5',
  })
  public readonly shippingCost: number;
}
