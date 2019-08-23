import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteParameterCommand } from './delete-parameter.command';
import { Uuid } from '../../../../../common/uuid';
import { InvalidUuidFormatException } from '../../../../../common/exceptions/invalid-uuid-format.exception';
import { Parameter } from '../../../../domain/category/parameter';
import { ParameterRepository } from '../../../../domain/category/parameter.repository';
import { ParameterNotFoundException } from '../../../../domain/category/exceptions/parameter-not-found.exception';

@CommandHandler(DeleteParameterCommand)
export class DeleteParameterHandler
  implements ICommandHandler<DeleteParameterCommand> {
  constructor(private readonly parameterRepository: ParameterRepository) {}

  public async execute(command: DeleteParameterCommand): Promise<any> {
    if (!Uuid.isUuidV4(command.id)) {
      throw new InvalidUuidFormatException();
    }

    const parameter: Parameter = await this.parameterRepository.findOne(
      command.id,
    );
    if (!parameter) {
      throw new ParameterNotFoundException();
    }

    await this.parameterRepository.delete(command.id);
  }
}
