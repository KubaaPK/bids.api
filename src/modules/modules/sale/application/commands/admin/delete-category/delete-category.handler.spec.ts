import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { DeleteCategoryHandler } from './delete-category.handler';
import { CategoryRepository } from '../../../../domain/category/category.repository';
import { ioCContainer } from '../../../../../../../config/ioc-container';
import { DeleteCategoryCommand } from './delete-category.command';
import { InvalidUuidFormatException } from '../../../../../../common/exceptions/invalid-uuid-format.exception';
import { CategoryNotFoundException } from '../../../../domain/category/exceptions/category-not-found.exception';
import { Category } from '../../../../domain/category/category';

describe('Delete Category Handler', () => {
  let handler: DeleteCategoryHandler;
  let categoryRepository: CategoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteCategoryHandler,
        ...ioCContainer,
        {
          provide: EntityManager,
          useValue: {
            getRepository: jest.fn().mockReturnThis(),
          },
        },
      ],
    }).compile();

    handler = module.get(DeleteCategoryHandler);
    categoryRepository = module.get(CategoryRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should Delete Category Handler be defined', async () => {
    expect(handler).toBeDefined();
  });

  it('should Category Repository be defined', async () => {
    expect(categoryRepository).toBeDefined();
  });

  it('should throw Invalid Uuid Format Exception if category id is not valid uuid', async () => {
    await expect(
      handler.execute(new DeleteCategoryCommand('invalid-uuid')),
    ).rejects.toThrowError(InvalidUuidFormatException);
  });

  it('should throw Internal Server Error Exception if selecting category from Postgres fails', async () => {
    jest.spyOn(categoryRepository, 'findOne').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    await expect(
      handler.execute(
        new DeleteCategoryCommand('5599b09f-7c94-44c7-93ff-311e9700a2c6'),
      ),
    ).rejects.toThrowError(InternalServerErrorException);
  });

  it('should throw Category Not Found Exception if category with given id does not exist', async () => {
    jest
      .spyOn(categoryRepository, 'findOne')
      .mockImplementationOnce(() => undefined);

    await expect(
      handler.execute(
        new DeleteCategoryCommand('5599b09f-7c94-44c7-93ff-311e9700a2c6'),
      ),
    ).rejects.toThrowError(CategoryNotFoundException);
  });

  it('should throw Internal Server Error Exception if deleting category from Postgres fails', async () => {
    jest
      .spyOn(categoryRepository, 'findOne')
      .mockImplementationOnce(async () => new Category());
    jest.spyOn(categoryRepository, 'delete').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    await expect(
      handler.execute(
        new DeleteCategoryCommand('5599b09f-7c94-44c7-93ff-311e9700a2c6'),
      ),
    ).rejects.toThrowError(InternalServerErrorException);
  });
});
