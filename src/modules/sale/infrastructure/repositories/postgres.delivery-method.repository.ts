import { DeliveryMethodRepository } from '../../domain/delivery/delivery-method.repository';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DeliveryMethod } from '../../domain/delivery/delivery-method';
import { AppLogger } from '../../../common/app-logger';
import { EntityManager, Repository } from 'typeorm';
import { ExceptionMessages } from '../../../common/exception-messages';
import { Uuid } from '../../../common/uuid';

@Injectable()
export class PostgresDeliveryMethodRepository
  implements DeliveryMethodRepository {
  private readonly logger: AppLogger = new AppLogger(
    PostgresDeliveryMethodRepository.name,
    true,
  );

  private readonly repository: Repository<DeliveryMethod>;

  constructor(private readonly manager: EntityManager) {
    this.repository = this.manager.getRepository(DeliveryMethod);
  }

  public async findOne(id: Uuid): Promise<DeliveryMethod | undefined>;
  public async findOne(name: string): Promise<DeliveryMethod | undefined>;
  public async findOne(
    arg: Uuid | string,
  ): Promise<DeliveryMethod | undefined> {
    if (Uuid.isUuidV4(arg)) {
      try {
        return await this.repository.findOne(arg as string);
      } catch (e) {
        this.logger.error(e.message);
        throw new InternalServerErrorException(
          ExceptionMessages.GENERIC_INTERNAL_SERVER_ERROR,
        );
      }
    } else {
      try {
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
  }

  // public async findOne(name: string): Promise<DeliveryMethod | undefined> {
  //   try {
  //     return await this.repository.findOne({
  //       where: {
  //         name,
  //       },
  //     });
  //   } catch (e) {
  //     this.logger.error(e.message);
  //     throw new InternalServerErrorException(
  //       ExceptionMessages.GENERIC_INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  public async save(deliveryMethod: DeliveryMethod): Promise<DeliveryMethod> {
    try {
      return await this.repository.save(deliveryMethod);
    } catch (e) {
      this.logger.error(e.message);
      throw new InternalServerErrorException(
        ExceptionMessages.GENERIC_INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async find(): Promise<DeliveryMethod[]> {
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
