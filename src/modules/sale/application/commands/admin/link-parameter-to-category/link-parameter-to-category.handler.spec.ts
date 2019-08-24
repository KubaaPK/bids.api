import { Test, TestingModule } from '@nestjs/testing';
import { LinkParameterToCategoryHandler } from './link-parameter-to-category.handler';
import { CategoryRepository } from '../../../../domain/category/category.repository';
import { ioCContainer } from '../../../../../../config/ioc-container';
import { EntityManager } from 'typeorm';
import { InvalidUuidFormatException } from '../../../../../common/exceptions/invalid-uuid-format.exception';
import { LinkParameterToCategoryCommand } from './link-parameter-to-category.command';
import { ParameterRepository } from '../../../../domain/category/parameter.repository';
import { InternalServerErrorException } from '@nestjs/common';
import { CategoryNotFoundException } from '../../../../domain/category/exceptions/category-not-found.exception';
import { Category } from '../../../../domain/category/category';
import { ParameterNotFoundException } from '../../../../domain/category/exceptions/parameter-not-found.exception';
import { Parameter } from '../../../../domain/category/parameter';
import { ParameterAlreadyLinkedToCategoryException } from '../../../../domain/category/exceptions/parameter-already-linked-to-category.exception';

describe('Link Parameter To Category Handler', () => {
  let handler: LinkParameterToCategoryHandler;
  let categoryRepository: CategoryRepository;
  let parameterRepository: ParameterRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LinkParameterToCategoryHandler,
        ...ioCContainer,
        {
          provide: EntityManager,
          useValue: {
            getRepository: jest.fn().mockReturnThis(),
          },
        },
      ],
    }).compile();

    handler = module.get(LinkParameterToCategoryHandler);
    categoryRepository = module.get(CategoryRepository);
    parameterRepository = module.get(ParameterRepository);
  });

  it('should Link Parameter To Category Handler be defined', async () => {
    expect(handler).toBeDefined();
  });

  it('should Category Repository be defined', async () => {
    expect(categoryRepository).toBeDefined();
  });

  it('should Parameter Repository be defined', async () => {
    expect(parameterRepository).toBeDefined();
  });

  it('should throw Invalid Uuid Format Exception if given category id is not valid uuid', async () => {
    await expect(
      handler.execute(
        new LinkParameterToCategoryCommand(
          'invalid-category-uuid',
          'd3ecc016-d134-40dd-a3a9-21268d81a5ba',
        ),
      ),
    ).rejects.toThrowError(InvalidUuidFormatException);
  });

  it('should throw Invalid Uuid Format Exception if parameter id is not valid uuid', async () => {
    await expect(
      handler.execute(
        new LinkParameterToCategoryCommand(
          'd3ecc016-d134-40dd-a3a9-21268d81a5ba',
          'invalid-parameter-uuid',
        ),
      ),
    ).rejects.toThrowError(InvalidUuidFormatException);
  });

  it('should throw Invalid Uuid Format Exception if both parameter id and category id are not valid uuid', async () => {
    await expect(
      handler.execute(
        new LinkParameterToCategoryCommand(
          'invalid-category-uuid',
          'invalid-parameter-uuid',
        ),
      ),
    ).rejects.toThrowError(InvalidUuidFormatException);
  });

  it('should throw Internal Server Error Exception if selecting category from Postgres fails', async () => {
    jest.spyOn(categoryRepository, 'findOne').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    await expect(
      handler.execute(
        new LinkParameterToCategoryCommand(
          '799c03d6-2e47-41cd-a68f-66640e5122fd',
          '13d9498c-b68f-4991-9746-e32196dab4a5',
        ),
      ),
    ).rejects.toThrowError(InternalServerErrorException);
  });

  it('should throw Category Not Found Exception if category with given id does not exists in Postgres', async () => {
    jest
      .spyOn(categoryRepository, 'findOne')
      .mockImplementationOnce(() => undefined);

    await expect(
      handler.execute(
        new LinkParameterToCategoryCommand(
          '799c03d6-2e47-41cd-a68f-66640e5122fd',
          '13d9498c-b68f-4991-9746-e32196dab4a5',
        ),
      ),
    ).rejects.toThrowError(CategoryNotFoundException);
  });

  it('should throw Internal Server Error Exception if selecting parameter from Postgres fails', async () => {
    jest
      .spyOn(categoryRepository, 'findOne')
      .mockImplementationOnce(async () => new Category());
    jest.spyOn(parameterRepository, 'findOne').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    await expect(
      handler.execute(
        new LinkParameterToCategoryCommand(
          '799c03d6-2e47-41cd-a68f-66640e5122fd',
          '13d9498c-b68f-4991-9746-e32196dab4a5',
        ),
      ),
    ).rejects.toThrowError(InternalServerErrorException);
  });

  it('should throw Parameter Not Found Exception if parameter with given id does not exist in Postgres', async () => {
    jest
      .spyOn(categoryRepository, 'findOne')
      .mockImplementationOnce(async () => new Category());
    jest
      .spyOn(parameterRepository, 'findOne')
      .mockImplementationOnce(() => undefined);

    await expect(
      handler.execute(
        new LinkParameterToCategoryCommand(
          '799c03d6-2e47-41cd-a68f-66640e5122fd',
          '13d9498c-b68f-4991-9746-e32196dab4a5',
        ),
      ),
    ).rejects.toThrowError(ParameterNotFoundException);
  });

  it('should throw Parameter Already Linked To Category Exception if given category already has the parameter linked', async () => {
    jest.spyOn(categoryRepository, 'findOne').mockImplementationOnce(async () =>
      Object.assign(new Category(), {
        parameters: new Promise(resolve =>
          resolve([
            ({
              id: '8082dc3a-9859-4297-882e-7d3046cd6946',
            } as unknown) as Parameter,
          ]),
        ),
      }),
    );
    jest
      .spyOn(parameterRepository, 'findOne')
      .mockImplementationOnce(async () =>
        Object.assign(new Parameter(), {
          id: '8082dc3a-9859-4297-882e-7d3046cd6946',
        }),
      );

    await expect(
      handler.execute(
        new LinkParameterToCategoryCommand(
          '799c03d6-2e47-41cd-a68f-66640e5122fd',
          '13d9498c-b68f-4991-9746-e32196dab4a5',
        ),
      ),
    ).rejects.toThrowError(ParameterAlreadyLinkedToCategoryException);
  });

  it('should throw Internal Server Error Exception if saving updated category to Postgres fails', async () => {
    jest.spyOn(categoryRepository, 'findOne').mockImplementationOnce(async () =>
      Object.assign(new Category(), {
        parameters: new Promise(resolve =>
          resolve([
            ({
              id: '8082dc3a-9859-4297-882e-7d3046cd6945',
            } as unknown) as Parameter,
          ]),
        ),
      }),
    );
    jest
      .spyOn(parameterRepository, 'findOne')
      .mockImplementationOnce(async () =>
        Object.assign(new Parameter(), {
          id: '8082dc3a-9859-4297-882e-7d3046cd6946',
        }),
      );
    jest.spyOn(categoryRepository, 'save').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    await expect(
      handler.execute(
        new LinkParameterToCategoryCommand(
          '799c03d6-2e47-41cd-a68f-66640e5122fd',
          '13d9498c-b68f-4991-9746-e32196dab4a5',
        ),
      ),
    ).rejects.toThrowError(InternalServerErrorException);
  });
});
