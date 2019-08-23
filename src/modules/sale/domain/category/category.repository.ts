import { Category } from './category';
import { Uuid } from '../../../common/uuid';

export abstract class CategoryRepository {
  public abstract async save(category: Category): Promise<Category>;
  public abstract async findOne(
    arg: string | Uuid,
  ): Promise<Category | undefined>;
  public abstract async findOne(id: Uuid): Promise<Category | undefined>;
  public abstract async find(): Promise<Category[]>;
  public abstract async delete(id: Uuid): Promise<void>;
}
