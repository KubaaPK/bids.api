import { Test, TestingModule } from '@nestjs/testing';
import { ListParametersHandler } from './list-parameters.handler';
import { ParameterRepository } from '../../../../domain/category/parameter.repository';
import { ioCContainer } from '../../../../../../config/ioc-container';
import { EntityManager } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { ListParametersQuery } from './list-parameters.query';
import { Parameter } from '../../../../domain/category/parameter';
import { ListableParameterDto } from '../../../dtos/read/listable-parameter.dto';

describe('List Parameter Handler', () => {
  let handler: ListParametersHandler;
  let parameterRepository: ParameterRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListParametersHandler,
        ...ioCContainer,
        {
          provide: EntityManager,
          useValue: {
            getRepository: jest.fn().mockReturnThis(),
          },
        },
      ],
    }).compile();

    handler = module.get(ListParametersHandler);
    parameterRepository = module.get(ParameterRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should List Parameter Handler be defined', async () => {
    expect(handler).toBeDefined();
  });

  it('should Parameter Repository be defined', async () => {
    expect(parameterRepository).toBeDefined();
  });

  it('should throw Internal Server Error Exception if selecting parameters from Postgres fails', async () => {
    jest.spyOn(parameterRepository, 'find').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    await expect(
      handler.execute(new ListParametersQuery()),
    ).rejects.toThrowError(InternalServerErrorException);
  });

  it('should return list of parameters', async () => {
    jest
      .spyOn(parameterRepository, 'find')
      .mockImplementationOnce(async () => [new Parameter(), new Parameter()]);

    const parameters: any[] = await handler.execute(new ListParametersQuery());

    expect(Array.isArray(parameters)).toBeTruthy();
  });

  it('should single element of parameters array be an instance of Listable Parameter Dto', async () => {
    jest
      .spyOn(parameterRepository, 'find')
      .mockImplementationOnce(async () => [new Parameter(), new Parameter()]);

    const parameters: ListableParameterDto[] = await handler.execute(
      new ListParametersQuery(),
    );

    expect(parameters[0]).toBeInstanceOf(ListableParameterDto);
  });
});
