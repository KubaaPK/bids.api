import { Test, TestingModule } from '@nestjs/testing';
import { ListCategoryParametersHandler } from './list-category-parameters.handler';
import { CategoryRepository } from '../../../domain/category/category.repository';
import { ioCContainer } from '../../../../../config/ioc-container';
import { EntityManager } from 'typeorm';
import { ListCategoryParametersQuery } from './list-category-parameters.query';
import { InvalidUuidFormatException } from '../../../../common/exceptions/invalid-uuid-format.exception';
import { CategoryNotFoundException } from '../../../domain/category/exceptions/category-not-found.exception';
import { Category } from '../../../domain/category/category';
import { Parameter } from '../../../domain/category/parameter';
import { ListableParameterDto } from '../../dtos/read/listable-parameter.dto';

describe('List Category Parameters Handler', () => {
  let handler: ListCategoryParametersHandler;
  let categoryRepository: CategoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListCategoryParametersHandler,
        ...ioCContainer,
        {
          provide: EntityManager,
          useValue: {
            getRepository: jest.fn().mockReturnThis(),
          },
        },
      ],
    }).compile();

    handler = module.get(ListCategoryParametersHandler);
    categoryRepository = module.get(CategoryRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should List Category Handler be defined', async () => {
    expect(handler).toBeDefined();
  });

  it('should Category Repository be defined', async () => {
    expect(categoryRepository).toBeDefined();
  });

  it('should throw Invalid Uuid Format Exception if category id is not valid uuid', async () => {
    await expect(
      handler.execute(new ListCategoryParametersQuery('invalid-category-id')),
    ).rejects.toThrowError(InvalidUuidFormatException);
  });

  it('should throw Category Not Found Exception if category with given id does not exist in Postgres', async () => {
    jest
      .spyOn(categoryRepository, 'findOne')
      .mockImplementationOnce(() => undefined);

    await expect(
      handler.execute(
        new ListCategoryParametersQuery('039e4db1-7c91-48a3-b184-3f630c589534'),
      ),
    ).rejects.toThrowError(CategoryNotFoundException);
  });

  it('should return an array with category parameters', async () => {
    jest.spyOn(categoryRepository, 'findOne').mockImplementationOnce(async () =>
      Object.assign(new Category(), {
        parameters: new Promise(resolve =>
          resolve([new Parameter(), new Parameter()]),
        ),
      }),
    );

    const parameters: any[] = await handler.execute(
      new ListCategoryParametersQuery('039e4db1-7c91-48a3-b184-3f630c589534'),
    );
    expect(Array.isArray(parameters)).toBeTruthy();
  });

  it('should single element of array of parameters be an instance of Listable Parameter Dto', async () => {
    jest.spyOn(categoryRepository, 'findOne').mockImplementationOnce(async () =>
      Object.assign(new Category(), {
        parameters: new Promise(resolve =>
          resolve([new Parameter(), new Parameter()]),
        ),
      }),
    );

    const parameters: ListableParameterDto[] = await handler.execute(
      new ListCategoryParametersQuery('039e4db1-7c91-48a3-b184-3f630c589534'),
    );

    expect(parameters[0]).toBeInstanceOf(ListableParameterDto);
  });
});
