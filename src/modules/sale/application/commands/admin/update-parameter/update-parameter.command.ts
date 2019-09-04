import { Uuid } from '../../../../../common/uuid';
import { UpdatedParameterDto } from '../../../dtos/write/parameter/updated-parameter.dto';

export class UpdateParameterCommand {
  constructor(
    public readonly id: Uuid,
    public readonly updatedParameter: UpdatedParameterDto,
  ) {}
}
