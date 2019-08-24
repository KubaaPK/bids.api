import { Test, TestingModule } from '@nestjs/testing';
import { UpdateParameterHandler } from './update-parameter.handler';
import { ParameterRepository } from '../../../../domain/category/parameter.repository';
import { ioCContainer } from '../../../../../../config/ioc-container';
import { EntityManager } from 'typeorm';
import { UpdateParameterCommand } from './update-parameter.command';
import { UpdatedParameterDto } from '../../../dtos/write/updated-parameter.dto';
import { InvalidUuidFormatException } from '../../../../../common/exceptions/invalid-uuid-format.exception';
import { ParameterNotFoundException } from '../../../../domain/category/exceptions/parameter-not-found.exception';
import { InternalServerErrorException } from '@nestjs/common';
import { Parameter } from '../../../../domain/category/parameter';

describe('Update Parameter Handler', () => {
  let handler: UpdateParameterHandler;
  let parameterRepository: ParameterRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateParameterHandler,
        ...ioCContainer,
        {
          provide: EntityManager,
          useValue: {
            getRepository: jest.fn().mockReturnThis(),
          },
        },
      ],
    }).compile();

    handler = module.get(UpdateParameterHandler);
    parameterRepository = module.get(ParameterRepository);
  });

  it('should Update Parameter Handler be defined', async () => {
    expect(handler).toBeDefined();
  });

  it('should Parameter Repository be defined', async () => {
    expect(parameterRepository).toBeDefined();
  });

  it('should throw Invalid Uuid Format Exception if parameter id is not valid uuid', async () => {
    const updatedParameter: UpdatedParameterDto = {
      name: 'updated-parameter-name',
    };

    await expect(
      handler.execute(
        new UpdateParameterCommand('invalid-uuid', updatedParameter),
      ),
    ).rejects.toThrowError(InvalidUuidFormatException);
  });

  it('should throw Internal Server Error Exception if selecting parameter from Postgres fails', async () => {
    jest.spyOn(parameterRepository, 'findOne').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    const updatedParameter: UpdatedParameterDto = {
      name: 'updated-parameter-name',
    };

    await expect(
      handler.execute(
        new UpdateParameterCommand(
          '71e2fb48-f842-4c89-9d20-ee3ac54f6357',
          updatedParameter,
        ),
      ),
    ).rejects.toThrowError(InternalServerErrorException);
  });

  it('should throw Parameter Not Found Exception if parameter with given id does not exist in Postgres', async () => {
    jest
      .spyOn(parameterRepository, 'findOne')
      .mockImplementationOnce(() => undefined);

    const updatedParameter: UpdatedParameterDto = {
      name: 'updated-parameter-name',
    };

    await expect(
      handler.execute(
        new UpdateParameterCommand(
          '71e2fb48-f842-4c89-9d20-ee3ac54f6357',
          updatedParameter,
        ),
      ),
    ).rejects.toThrowError(ParameterNotFoundException);
  });

  it('should throw Internal Server Error Exception if saving updated parameter to Postgres fails', async () => {
    jest
      .spyOn(parameterRepository, 'findOne')
      .mockImplementationOnce(async () => new Parameter());
    jest.spyOn(parameterRepository, 'save').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    const updatedParameter: UpdatedParameterDto = {
      name: 'updated-parameter-name',
    };

    await expect(
      handler.execute(
        new UpdateParameterCommand(
          '71e2fb48-f842-4c89-9d20-ee3ac54f6357',
          updatedParameter,
        ),
      ),
    ).rejects.toThrowError(InternalServerErrorException);
  });
});
