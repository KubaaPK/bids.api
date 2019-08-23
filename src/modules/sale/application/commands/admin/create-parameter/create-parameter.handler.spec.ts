import { Test, TestingModule } from '@nestjs/testing';
import { CreateParameterHandler } from './create-parameter.handler';
import { ParameterRepository } from '../../../../domain/category/parameter.repository';
import { ioCContainer } from '../../../../../../config/ioc-container';
import { EntityManager } from 'typeorm';
import { NewParameterDto } from '../../../dtos/write/new-parameter.dto';
import { ParameterType } from '../../../../domain/category/parameter-type.enum';
import { CreateParameterCommand } from './create-parameter.command';
import { InternalServerErrorException } from '@nestjs/common';
import { NoDictionarySpecifiedException } from '../../../../domain/category/exceptions/no-dictionary-specified.exception';

describe('Create Parameter Handler', () => {
  let handler: CreateParameterHandler;
  let parameterRepository: ParameterRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateParameterHandler,
        ...ioCContainer,
        {
          provide: EntityManager,
          useValue: {
            getRepository: jest.fn().mockReturnThis(),
          },
        },
      ],
    }).compile();

    handler = module.get(CreateParameterHandler);
    parameterRepository = module.get(ParameterRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should Create Parameter Handler be defined', async () => {
    expect(handler).toBeDefined();
  });

  it('should Parameter Repository be defined', async () => {
    expect(parameterRepository).toBeDefined();
  });

  it('should throw No Dictionary Specified Exception if parameter of type DICTIONARY if dictionary array is empty', async () => {
    jest
      .spyOn(parameterRepository, 'save')
      .mockImplementationOnce(() => undefined);

    const newParameter: NewParameterDto = {
      id: '3eb69442-a488-4b23-a979-c625b3d48645',
      dictionary: [],
      name: 'stan',
      required: false,
      restrictions: {
        multipleChoices: false,
      },
      type: ParameterType.DICTIONARY,
    };

    await expect(
      handler.execute(new CreateParameterCommand(newParameter)),
    ).rejects.toThrowError(NoDictionarySpecifiedException);
  });

  it('should throw No Dictionary Specified Exception if parameter of type DICTIONARY if dictionary array has not been provided', async () => {
    jest
      .spyOn(parameterRepository, 'save')
      .mockImplementationOnce(() => undefined);

    const newParameter: NewParameterDto = {
      id: '3eb69442-a488-4b23-a979-c625b3d48645',
      name: 'stan',
      required: false,
      restrictions: {
        multipleChoices: false,
      },
      type: ParameterType.DICTIONARY,
    };

    await expect(
      handler.execute(new CreateParameterCommand(newParameter)),
    ).rejects.toThrowError(NoDictionarySpecifiedException);
  });

  it('should throw Internal Server Error Exception if saving parameter to Postgres fails', async () => {
    jest.spyOn(parameterRepository, 'save').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    const newParameter: NewParameterDto = {
      id: '3eb69442-a488-4b23-a979-c625b3d48645',
      dictionary: ['nowy', 'używany', 'ze zwrotu'],
      name: 'stan',
      required: false,
      restrictions: {
        multipleChoices: false,
      },
      type: ParameterType.DICTIONARY,
    };

    await expect(
      handler.execute(new CreateParameterCommand(newParameter)),
    ).rejects.toThrowError(InternalServerErrorException);
  });
});
