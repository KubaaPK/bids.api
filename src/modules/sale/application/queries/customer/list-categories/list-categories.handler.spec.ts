import { Test, TestingModule } from '@nestjs/testing';
import { ListCategoriesHandler } from './list-categories.handler';
import { CategoryRepository } from '../../../../domain/category/category.repository';
import { ioCContainer } from '../../../../../../config/ioc-container';
import { EntityManager } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { ListCategoriesQuery } from './list-categories.query';
import { Category } from '../../../../domain/category/category';
import { ListableCategoryDto } from '../../../dtos/read/listable-category.dto';

describe('List Categories Handler', () => {
  let handler: ListCategoriesHandler;
  let categoryRepository: CategoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListCategoriesHandler,
        ...ioCContainer,
        {
          provide: EntityManager,
          useValue: {
            getRepository: jest.fn().mockReturnThis(),
          },
        },
      ],
    }).compile();

    handler = module.get(ListCategoriesHandler);
    categoryRepository = module.get(CategoryRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should List Categories Handler be defined', async () => {
    expect(handler).toBeDefined();
  });

  it('should Category Repository be defined', async () => {
    expect(categoryRepository).toBeDefined();
  });

  it('should throw Internal Server Error Exception if selecting categories from Postgres fails', async () => {
    jest.spyOn(categoryRepository, 'find').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    await expect(
      handler.execute(new ListCategoriesQuery(false)),
    ).rejects.toThrowError(InternalServerErrorException);
  });

  it('should return an array of Categories', async () => {
    jest.spyOn(categoryRepository, 'find').mockImplementationOnce(async () => {
      return [new Category(), new Category()];
    });

    const categories: any[] = await handler.execute(
      new ListCategoriesQuery(false),
    );

    expect(Array.isArray(categories)).toBeTruthy();
  });

  it('should call findAll method if flat query value is true', async () => {
    const spyFindAll = jest
      .spyOn(categoryRepository, 'findAll')
      .mockImplementationOnce(async () => {
        return [new Category(), new Category()];
      });

    const spyFind = jest
      .spyOn(categoryRepository, 'find')
      .mockImplementationOnce(async () => {
        return [new Category(), new Category()];
      });
    const categories: any[] = await handler.execute(
      new ListCategoriesQuery(true),
    );

    expect(spyFindAll).toBeCalled();
    expect(spyFind).not.toBeCalled();
  });

  it('should single array element be an instance of Listable Category Dto', async () => {
    jest.spyOn(categoryRepository, 'find').mockImplementationOnce(async () => {
      return [new Category(), new Category()];
    });

    const categories: ListableCategoryDto[] = await handler.execute(
      new ListCategoriesQuery(false),
    );

    expect(categories[0]).toBeInstanceOf(ListableCategoryDto);
  });
});
