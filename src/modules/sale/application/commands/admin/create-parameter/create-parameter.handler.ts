import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateParameterCommand } from './create-parameter.command';
import { ParameterRepository } from '../../../../domain/category/parameter.repository';
import { Parameter } from '../../../../domain/category/parameter';

@CommandHandler(CreateParameterCommand)
export class CreateParameterHandler
  implements ICommandHandler<CreateParameterCommand> {
  constructor(private readonly parameterRepository: ParameterRepository) {}

  public async execute(command: CreateParameterCommand): Promise<void> {
    const parameter: Parameter = Parameter.create(command.newParameter);
    await this.parameterRepository.save(parameter);
  }
}
