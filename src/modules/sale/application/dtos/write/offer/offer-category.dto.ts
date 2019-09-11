import { Uuid } from '../../../../../common/uuid';
import { IsUUID } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class OfferCategoryDto {
  @ApiModelProperty({
    type: String,
    required: true,
    example: '07062cdb-7030-450a-b7ae-ff10dbfff1bd',
  })
  @IsUUID('4', {
    message: 'Nieprawidłowy format ID kategorii.',
  })
  public readonly id: Uuid;
}
