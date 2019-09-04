import { NewParameterDto } from '../../../dtos/write/parameter/new-parameter.dto';

export class CreateParameterCommand {
  constructor(public readonly newParameter: NewParameterDto) {}
}
