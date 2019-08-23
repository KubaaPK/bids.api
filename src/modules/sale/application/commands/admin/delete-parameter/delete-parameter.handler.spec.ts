import { Test, TestingModule } from '@nestjs/testing';
import { DeleteParameterHandler } from './delete-parameter.handler';
import { ParameterRepository } from '../../../../domain/category/parameter.repository';
import { ioCContainer } from '../../../../../../config/ioc-container';
import { EntityManager } from 'typeorm';
import { DeleteParameterCommand } from './delete-parameter.command';
import { InvalidUuidFormatException } from '../../../../../common/exceptions/invalid-uuid-format.exception';
import { ParameterNotFoundException } from '../../../../domain/category/exceptions/parameter-not-found.exception';
import { Parameter } from '../../../../domain/category/parameter';
import { InternalServerErrorException } from '@nestjs/common';

describe('Delete Parameter Handler', () => {
  let handler: DeleteParameterHandler;
  let parameterRepository: ParameterRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteParameterHandler,
        ...ioCContainer,
        {
          provide: EntityManager,
          useValue: {
            getRepository: jest.fn().mockReturnThis(),
          },
        },
      ],
    }).compile();

    handler = module.get(DeleteParameterHandler);
    parameterRepository = module.get(ParameterRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should Delete Parameter Handler be defined', async () => {
    expect(handler).toBeDefined();
  });

  it('should Parameter Repository be defined', async () => {
    expect(parameterRepository).toBeDefined();
  });

  it('should throw Invalid Uuid Format Exception if given parameter id is not valid uuid', async () => {
    await expect(
      handler.execute(new DeleteParameterCommand('invalid-uuid')),
    ).rejects.toThrowError(InvalidUuidFormatException);
  });

  it('should throw Parameter Not Found Exception if parameter with given id does not exist in Postgres', async () => {
    jest
      .spyOn(parameterRepository, 'findOne')
      .mockImplementationOnce(() => undefined);

    await expect(
      handler.execute(
        new DeleteParameterCommand('960e6842-629c-45db-b071-450a145bb5cb'),
      ),
    ).rejects.toThrowError(ParameterNotFoundException);
  });

  it('should throw Internal Server Error Exception if deleting parameter from Postgres fails', async () => {
    jest
      .spyOn(parameterRepository, 'findOne')
      .mockImplementationOnce(async () => new Parameter());
    jest.spyOn(parameterRepository, 'delete').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    await expect(
      handler.execute(
        new DeleteParameterCommand('960e6842-629c-45db-b071-450a145bb5cb'),
      ),
    ).rejects.toThrowError(InternalServerErrorException);
  });
});
