import { Uuid } from '../../../../../common/uuid';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class LinkableParameterToCategoryDto {
  @ApiModelProperty({
    type: Uuid,
    example: 'f8740568-2737-45d9-81da-3a589e05191c',
    required: true,
    description: 'Id of parameter to link.',
  })
  @IsNotEmpty({
    message: 'Id parametru jest wymagane.',
  })
  @IsUUID('4', {
    message: 'Id parametru nie jest poprawnym UUID.',
  })
  public readonly parameterId: Uuid;
}
