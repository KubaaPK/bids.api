import { Test, TestingModule } from '@nestjs/testing';
import { UpdateCategoryHandler } from './update-category.handler';
import { CategoryRepository } from '../../../../domain/category/category.repository';
import { ioCContainer } from '../../../../../../config/ioc-container';
import { EntityManager } from 'typeorm';
import { UpdateCategoryCommand } from './update-category.command';
import { InvalidUuidFormatException } from '../../../../../common/exceptions/invalid-uuid-format.exception';
import { UpdatedCategoryDto } from '../../../dtos/write/updated-category.dto';
import { CategoryNotFoundException } from '../../../../domain/category/exceptions/category-not-found.exception';
import { InternalServerErrorException } from '@nestjs/common';
import { Category } from '../../../../domain/category/category';

describe('Update Category Handler', () => {
  let handler: UpdateCategoryHandler;
  let categoryRepository: CategoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateCategoryHandler,
        ...ioCContainer,
        {
          provide: EntityManager,
          useValue: {
            getRepository: jest.fn().mockReturnThis(),
          },
        },
      ],
    }).compile();

    handler = module.get(UpdateCategoryHandler);
    categoryRepository = module.get(CategoryRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should Update Category Handler be defined', async () => {
    expect(handler).toBeDefined();
  });

  it('should Category Repository be defined', async () => {
    expect(categoryRepository).toBeDefined();
  });

  it('should throw Invalid Uuid Format if category id is not valid uuid', async () => {
    const updatedCategory: UpdatedCategoryDto = {
      name: 'Telewizory',
    };

    await expect(
      handler.execute(
        new UpdateCategoryCommand('invalid-uuid', updatedCategory),
      ),
    ).rejects.toThrowError(InvalidUuidFormatException);
  });

  it('should throw Category Not Found Exception if category with given id does not exist in Postgres', async () => {
    jest
      .spyOn(categoryRepository, 'findOne')
      .mockImplementationOnce(() => undefined);

    const updatedCategory: UpdatedCategoryDto = {
      name: 'Telewizory',
    };

    await expect(
      handler.execute(
        new UpdateCategoryCommand(
          '04f538a8-7e77-442c-ac04-d6c9752ca161',
          updatedCategory,
        ),
      ),
    ).rejects.toThrowError(CategoryNotFoundException);
  });

  it('should throw Internal Server Error Exception if saving updated category to Postgres fails', async () => {
    jest
      .spyOn(categoryRepository, 'findOne')
      .mockImplementationOnce(async () => new Category());
    jest.spyOn(categoryRepository, 'save').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    const updatedCategory: UpdatedCategoryDto = {
      name: 'Telewizory',
    };

    await expect(
      handler.execute(
        new UpdateCategoryCommand(
          '04f538a8-7e77-442c-ac04-d6c9752ca161',
          updatedCategory,
        ),
      ),
    ).rejects.toThrowError(InternalServerErrorException);
  });
});
