import { SaveSaleHandler } from './save-sale.handler';
import { SaleRepository } from '../../../../domain/sale/sale.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { ioCContainer } from '../../../../../../config/ioc-container';
import { EntityManager } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import * as faker from 'faker';
import { SaveSaleCommand } from './save-sale.command';
import { Offer } from '../../../../domain/offer/offer';
import { Customer } from '../../../../domain/customer/customer';

describe('Save Sale Handler', () => {
  let handler: SaveSaleHandler;
  let saleRepository: SaleRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SaveSaleHandler,
        ...ioCContainer,
        {
          provide: EntityManager,
          useValue: {
            getRepository: jest.fn().mockReturnThis(),
          },
        },
      ],
    }).compile();

    handler = module.get(SaveSaleHandler);
    saleRepository = module.get(SaleRepository);
  });

  it('should Save Sale Handler be defined', async () => {
    expect(handler).toBeDefined();
  });

  it('should Sale Repository be defined', async () => {
    expect(saleRepository).toBeDefined();
  });

  it('should Internal Server Error Exception if saving sale to Postgres fails', async () => {
    jest.spyOn(saleRepository, 'save').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    await expect(
      handler.execute(
        new SaveSaleCommand(
          Object.assign(new Offer(), {
            id: faker.random.uuid(),
            customer: Object.assign(new Customer(), {
              id: faker.random.uuid(),
            }),
          }),
          faker.random.uuid(),
        ),
      ),
    ).rejects.toThrowError(InternalServerErrorException);
  });
});
