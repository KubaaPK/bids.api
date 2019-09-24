import { IsEnum, IsNumber, ValidateNested } from 'class-validator';
import { EnumUtils } from '../../../../common/utils/enum-utils';
import { ApiModelProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { SellingModeDto } from '../../../../sale/application/dtos/write/offer/selling-mode.dto';

export enum CategoriesNames {
  SMARTPHONES = 'Smartfony',
  SMARTWATCHES = 'Smartwatche',
  TABLETS = 'Tablety',
  ACCESSORIES_GSM = 'Akcesoria GSM',
  LAPTOPS = 'Laptopy',
  MONITORS = 'Monitors',
  PCS = 'Komputery stacjonarne',
  PRINTERS_AND_SCANNERS = 'Drukarki i skanery',
  PROJECTORS = 'Projektory',
  TVS = 'Telewizory',
  FRAGRANCES_FOR_MEN = 'Zapachy dla mężczyzn',
  FRAGRANCES_FOR_WOMEN = 'Zapachy dla kobiet',
  HAIRPASTE = 'Pasta do włosów',
  MAKEUP = 'Makijaż',
  SHAVING = 'Golenie',
  BOOKS = 'Książki',
  GAMES = 'Gry',
  MOVIES = 'Filmy',
  MUSIC = 'Muzyka',
  FEMALE_CLOTHING = 'Odzież damska',
  FEMALE_JEWELRY = 'Biżuteria damska',
  FEMALE_SHOES = 'Buty damskie',
  FEMALE_WATCHES = 'Zegarki damskie',
  MALE_CLOTHING = 'Odzież męska',
  MALE_JEWELRY = 'Biżuteria męska',
  MALE_SHOES = 'Buty męskie',
  MALE_WATCHES = 'Zegarki męskie',
  BLOOD_PRESSURE_MONITORS = 'Ciśnieniomierze',
  DIETARY_SUPPLEMENTS = 'Suplementy diety',
  ELECTRIC_BRUSHES = 'Szczoteczki elektryczne',
  MASSAGE_EQUIPMENT = 'Sprzęt do masażu',
  REHABILITATION = 'Rehabilitacja',
  TEETH_WHITENING = 'Wybielanie zębów',
  THERMOMETERS = 'Termometry',
  TOOTHPASTES = 'Pasty do zębów',
  GARDENING_TOOLS = 'Narzędzia ogrodnicze',
  IRRIGATION = 'Nawadnianie',
  LAMP_ACCESSORIES = 'Akcesoria i osprzęt',
  LAMPS = 'Oświetlenie',
  PLANTS = 'Rośliny',
  SAWS_AND_CHAINSAWS = 'Piły i pilarki',
  SCREWDRIVERS = 'Wkrętarki',
  WELDERS = 'Spawarki',
  BICYCLES_AND_ACCESSORIES = 'Rowery i akcesoria',
  GYM_AND_FITNESS = 'Siłownia i fitness',
  SKATING_SLACKLINE = 'Skating, slackline',
}

export class CalculatableOfferDto {
  @ApiModelProperty({
    enum: CategoriesNames,
    example: CategoriesNames.GYM_AND_FITNESS,
    description: 'Category name.',
  })
  @IsEnum(CategoriesNames, {
    message: `Nieprawidłowa nazwa kategorii. Dostępne kategorie to: ${EnumUtils.printEnumValues(
      CategoriesNames,
    )}`,
  })
  public readonly category: CategoriesNames;

  @ApiModelProperty({
    type: SellingModeDto,
  })
  @ValidateNested()
  @Type(() => SellingModeDto)
  public readonly sellingMode: SellingModeDto;

  @IsNumber(
    {},
    {
      message: 'Należy zdefiniować liczbę sztuk danego przedmiotu.',
    },
  )
  @ApiModelProperty({
    type: Number,
    example: 3,
    description: 'Product amount.',
    required: true,
  })
  public readonly amount?: number;
}
