import { Test, TestingModule } from '@nestjs/testing';
import { ListCategoryHandler } from './list-category.handler';
import { CategoryRepository } from '../../../domain/category/category.repository';
import { ioCContainer } from '../../../../../../config/ioc-container';
import { EntityManager } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { ListCategoryQuery } from './list-category.query';
import { InvalidUuidFormatException } from '../../../../../common/exceptions/invalid-uuid-format.exception';
import { CategoryNotFoundException } from '../../../domain/category/exceptions/category-not-found.exception';
import { Category } from '../../../domain/category/category';
import { ListableCategoryDto } from '../../dtos/read/listable-category.dto';

describe('List Category Handler', () => {
  let handler: ListCategoryHandler;
  let categoryRepository: CategoryRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ListCategoryHandler,
        ...ioCContainer,
        {
          provide: EntityManager,
          useValue: {
            getRepository: jest.fn().mockReturnThis(),
          },
        },
      ],
    }).compile();

    handler = module.get(ListCategoryHandler);
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

  it('should throw Invalid Uuid Format Exception if category id is not valid uuid v4', async () => {
    await expect(
      handler.execute(new ListCategoryQuery('invalid-uuid')),
    ).rejects.toThrowError(InvalidUuidFormatException);
  });

  it('should throw Internal Server Error Exception if selecting category from Postgres fails', async () => {
    jest.spyOn(categoryRepository, 'findOne').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    await expect(
      handler.execute(
        new ListCategoryQuery('150ea7ef-cbe1-4eea-9483-0ce8b961ca53'),
      ),
    ).rejects.toThrowError(InternalServerErrorException);
  });

  it('should throw Category Not Exception if category with given id does not exists in Postgres', async () => {
    jest
      .spyOn(categoryRepository, 'findOne')
      .mockImplementationOnce(() => undefined);

    await expect(
      handler.execute(
        new ListCategoryQuery('150ea7ef-cbe1-4eea-9483-0ce8b961ca53'),
      ),
    ).rejects.toThrowError(CategoryNotFoundException);
  });

  it('should listed category be an instance of Listable Category Dto', async () => {
    jest
      .spyOn(categoryRepository, 'findOne')
      .mockImplementationOnce(async () => new Category());

    const category: ListableCategoryDto = await handler.execute(
      new ListCategoryQuery('150ea7ef-cbe1-4eea-9483-0ce8b961ca53'),
    );

    expect(category).toBeInstanceOf(ListableCategoryDto);
  });
});
