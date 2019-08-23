import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListParametersQuery } from './list-parameters.query';
import { ParameterRepository } from '../../../../domain/category/parameter.repository';
import { Parameter } from '../../../../domain/category/parameter';
import { plainToClass } from 'class-transformer';
import { ListableParameterDto } from '../../../dtos/read/listable-parameter.dto';

@QueryHandler(ListParametersQuery)
export class ListParametersHandler
  implements IQueryHandler<ListParametersQuery> {
  constructor(private readonly parameterRepository: ParameterRepository) {}

  public async execute(command: ListParametersQuery): Promise<any> {
    const parameters: Parameter[] = await this.parameterRepository.find();

    return parameters.map((parameter: Parameter) => {
      return plainToClass(ListableParameterDto, parameter);
    });
  }
}
