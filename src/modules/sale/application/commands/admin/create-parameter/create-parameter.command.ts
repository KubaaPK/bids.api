import { NewParameterDto } from '../../../dtos/write/new-parameter.dto';

export class CreateParameterCommand {
  constructor(public readonly newParameter: NewParameterDto) {}
}
