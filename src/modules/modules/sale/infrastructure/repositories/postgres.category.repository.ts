import { CategoryRepository } from '../../domain/category/category.repository';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AppLogger } from '../../../../common/app-logger';
import { EntityManager, EntityRepository, Repository } from 'typeorm';
import { Category } from '../../domain/category/category';
import { Uuid } from '../../../../common/uuid';
import { ExceptionMessages } from '../../../../common/exception-messages';

@Injectable()
@EntityRepository()
export class PostgresCategoryRepository implements CategoryRepository {
  private readonly logger: AppLogger = new AppLogger(
    PostgresCategoryRepository.name,
    true,
  );

  private readonly repository: Repository<Category>;

  constructor(private readonly manager: EntityManager) {
    this.repository = this.manager.getRepository(Category);
  }

  public async findOne(name: string): Promise<Category | undefined>;
  public async findOne(id: Uuid): Promise<Category | undefined>;
  public async findOne(arg: string | Uuid): Promise<Category | undefined> {
    try {
      if (Uuid.isUuidV4(arg)) {
        return await this.repository.findOne(arg as Uuid);
      }
      return await this.repository.findOne({
        where: {
          name: arg,
        },
      });
    } catch (e) {
      this.logger.error(e.message);
      throw new InternalServerErrorException(
        ExceptionMessages.GENERIC_INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async save(category: Category): Promise<Category> {
    try {
      return await this.repository.save(category);
    } catch (e) {
      this.logger.error(e.message);
      throw new InternalServerErrorException(
        ExceptionMessages.GENERIC_INTERNAL_SERVER_ERROR,
      );
    }
  }
}
