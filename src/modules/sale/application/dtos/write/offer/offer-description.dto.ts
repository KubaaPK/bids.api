import { OfferDescriptionItemType } from '../../../../domain/offer/description/offer-description-item-type';
import { ApiModelProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class DescriptionItem {
  @ApiModelProperty({
    enum: OfferDescriptionItemType,
    required: true,
    example: OfferDescriptionItemType.TEXT,
    description: 'Type of description item.',
  })
  public readonly type: OfferDescriptionItemType;

  @ApiModelProperty({
    required: true,
    example: '<p>Lorem ipsum.</p>',
    description: 'Required if description item has TEXT type.',
  })
  public readonly content?: string;

  @ApiModelProperty({
    required: true,
    description: 'Required if description item has IMAGE type.',
  })
  public readonly url?: string;
}

export class OfferDescriptionDto {
  @ApiModelProperty({
    type: [DescriptionItem],
  })
  @ValidateNested({ each: true })
  @Type(() => DescriptionItem)
  public readonly sections: {
    items: DescriptionItem[];
  }[];
}
