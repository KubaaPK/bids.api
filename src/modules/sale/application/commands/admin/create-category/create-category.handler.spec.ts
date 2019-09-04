import { Test, TestingModule } from '@nestjs/testing';
import { CreateCategoryHandler } from './create-category.handler';
import { CategoryRepository } from '../../../../domain/category/category.repository';
import { ioCContainer } from '../../../../../../config/ioc-container';
import { EntityManager } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { NewCategoryDto } from '../../../dtos/write/category/new-category.dto';
import { CreateCategoryCommand } from './create-category.command';
import { Category } from '../../../../domain/category/category';
import { CategoryAlreadyExistsException } from '../../../../domain/category/exceptions/category-already-exists.exception';

describe('Create Category Handler', () => {
  let handler: CreateCategoryHandler;
  let categoryRepository: CategoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCategoryHandler,
        ...ioCContainer,
        {
          provide: EntityManager,
          useValue: {
            getRepository: jest.fn().mockReturnThis(),
          },
        },
      ],
    }).compile();

    handler = module.get(CreateCategoryHandler);
    categoryRepository = module.get(CategoryRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should Create Category Handler be defined', async () => {
    expect(handler).toBeDefined();
  });

  it('should Category Repository be defined', async () => {
    expect(categoryRepository).toBeDefined();
  });

  it('should throw Internal Server Error Exception if finding category in Postgres fails', async () => {
    jest.spyOn(categoryRepository, 'findOne').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    const newCategory: NewCategoryDto = {
      id: '23b8e67a-32f3-4c81-b3a3-792762410027',
      name: 'TV',
    };

    await expect(
      handler.execute(new CreateCategoryCommand(newCategory)),
    ).rejects.toThrowError(InternalServerErrorException);
  });

  it('should throw Category Already Exists Exception if category with given name already exists in Postgres', async () => {
    jest
      .spyOn(categoryRepository, 'findOne')
      .mockImplementationOnce(async () => new Category());

    const newCategory: NewCategoryDto = {
      id: '23b8e67a-32f3-4c81-b3a3-792762410027',
      name: 'TV',
    };

    await expect(
      handler.execute(new CreateCategoryCommand(newCategory)),
    ).rejects.toThrowError(CategoryAlreadyExistsException);
  });

  it('should throw Internal Server Error Exception if selecting parent category from Postgres fails', async () => {
    jest.spyOn(categoryRepository, 'findOne').mock;
  });

  it('should throw Internal Server Error Exception if saving category to Postgres fails', async () => {
    jest
      .spyOn(categoryRepository, 'findOne')
      .mockImplementationOnce(async () => undefined);
    jest.spyOn(categoryRepository, 'save').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    const newCategory: NewCategoryDto = {
      id: '23b8e67a-32f3-4c81-b3a3-792762410027',
      name: 'TV',
    };

    await expect(
      handler.execute(new CreateCategoryCommand(newCategory)),
    ).rejects.toThrowError(InternalServerErrorException);
  });
});
