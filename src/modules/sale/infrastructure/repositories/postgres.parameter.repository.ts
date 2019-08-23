import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ParameterRepository } from '../../domain/category/parameter.repository';
import { AppLogger } from '../../../common/app-logger';
import { EntityManager, Repository } from 'typeorm';
import { Parameter } from '../../domain/category/parameter';
import { ExceptionMessages } from '../../../common/exception-messages';
import { Uuid } from '../../../common/uuid';

@Injectable()
export class PostgresParameterRepository implements ParameterRepository {
  private readonly logger: AppLogger = new AppLogger(
    PostgresParameterRepository.name,
    true,
  );

  private readonly repository: Repository<Parameter>;

  constructor(private readonly manager: EntityManager) {
    this.repository = this.manager.getRepository(Parameter);
  }

  public async save(parameter: Parameter): Promise<Parameter> {
    try {
      return await this.repository.save(parameter);
    } catch (e) {
      this.logger.error(e.message);
      throw new InternalServerErrorException(
        ExceptionMessages.GENERIC_INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async findOne(id: Uuid): Promise<Parameter | undefined> {
    try {
      return await this.repository.findOne(id);
    } catch (e) {
      this.logger.error(e.message);
      throw new InternalServerErrorException(
        ExceptionMessages.GENERIC_INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async find(): Promise<Parameter[]> {
    try {
      return await this.repository.find();
    } catch (e) {
      this.logger.error(e.message);
      throw new InternalServerErrorException(
        ExceptionMessages.GENERIC_INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async delete(id: Uuid): Promise<void> {
    try {
      await this.repository.delete(id);
    } catch (e) {
      this.logger.error(e.message);
      throw new InternalServerErrorException(
        ExceptionMessages.GENERIC_INTERNAL_SERVER_ERROR,
      );
    }
  }
}
