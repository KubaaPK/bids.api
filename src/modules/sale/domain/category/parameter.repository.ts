import { Parameter } from './parameter';
import { Uuid } from '../../../common/uuid';

export abstract class ParameterRepository {
  public abstract async save(parameter: Parameter): Promise<Parameter>;
  public abstract async findOne(id: Uuid): Promise<Parameter | undefined>;
  public abstract async delete(id: Uuid): Promise<void>;
}
