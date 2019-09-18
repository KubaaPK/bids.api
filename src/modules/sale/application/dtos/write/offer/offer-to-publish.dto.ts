import { Uuid } from '../../../../../common/uuid';
import { IsUUID } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class OfferToPublishDto {
  @ApiModelProperty({
    required: true,
    type: String,
    description: 'ID of the offer that would be published.',
    example: '5a171a1a-11e2-4d03-8d1a-29fe263d4581',
  })
  @IsUUID('4', {
    message: 'Niepoprawny format id.',
  })
  public readonly offerId: Uuid;
}
