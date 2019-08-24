import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateParameterCommand } from './update-parameter.command';
import { ParameterRepository } from '../../../../domain/category/parameter.repository';
import { Parameter } from '../../../../domain/category/parameter';
import { ParameterNotFoundException } from '../../../../domain/category/exceptions/parameter-not-found.exception';
import { Uuid } from '../../../../../common/uuid';
import { InvalidUuidFormatException } from '../../../../../common/exceptions/invalid-uuid-format.exception';

@CommandHandler(UpdateParameterCommand)
export class UpdateParameterHandler
  implements ICommandHandler<UpdateParameterCommand> {
  constructor(private readonly parameterRepository: ParameterRepository) {}

  public async execute(command: UpdateParameterCommand): Promise<void> {
    if (!Uuid.isUuidV4(command.id)) {
      throw new InvalidUuidFormatException();
    }

    const parameter: Parameter = await this.parameterRepository.findOne(
      command.id,
    );
    if (!parameter) {
      throw new ParameterNotFoundException();
    }

    parameter.update(command.updatedParameter);
    await this.parameterRepository.save(parameter);
  }
}
