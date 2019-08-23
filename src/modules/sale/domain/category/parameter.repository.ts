import { Parameter } from './parameter';

export abstract class ParameterRepository {
  public abstract async save(parameter: Parameter): Promise<Parameter>;
}
