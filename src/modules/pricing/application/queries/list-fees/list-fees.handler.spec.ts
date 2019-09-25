import { ListFeesHandler } from './list-fees.handler';
import { FeeRepository } from '../../../domain/fee/fee.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { ioCContainer } from '../../../../../config/ioc-container';
import { EntityManager } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { ListFeesQuery } from './list-fees.query';
import * as faker from 'faker';
import { Fee } from '../../../domain/fee/fee';
import { ListableFeeDto } from '../../dtos/read/listable-fee.dto';
import { FeeStatus } from '../../../domain/fee/fee-status';

describe('List Outstanding Fees Handler', () => {
  let handler: ListFeesHandler;
  let feeRepository: FeeRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListFeesHandler,
        ...ioCContainer,
        {
          provide: EntityManager,
          useValue: {
            getRepository: jest.fn().mockReturnThis(),
          },
        },
      ],
    }).compile();

    handler = module.get(ListFeesHandler);
    feeRepository = module.get(FeeRepository);
  });

  it('should List Outstanding Fees Handler be defined', async () => {
    expect(handler).toBeDefined();
  });

  it('should Fee Repository be defined', async () => {
    expect(feeRepository).toBeDefined();
  });

  it('should throw Internal Server Error Exception if selecting fees from Postgres fails', async () => {
    jest.spyOn(feeRepository, 'find').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    await expect(
      handler.execute(new ListFeesQuery(faker.random.uuid())),
    ).rejects.toThrowError(InternalServerErrorException);
  });

  it('should return array of remain fees to pay', async () => {
    const unPaidFee: Fee = Object.assign(new Fee(), {
      status: FeeStatus.UN_PAID,
    });
    const paidFee: Fee = Object.assign(new Fee(), {
      status: FeeStatus.PAID,
    });

    jest
      .spyOn(feeRepository, 'find')
      .mockImplementationOnce(async () => [unPaidFee, unPaidFee, paidFee]);

    const fees: any = await handler.execute(
      new ListFeesQuery(faker.random.uuid()),
    );

    expect(Array.isArray(fees)).toBeTruthy();
    expect(fees).toHaveLength(2);
  });

  it('should single fee array element be an instance of Listable Outstanding Fee Dto', async () => {
    const unPaidFee: Fee = Object.assign(new Fee(), {
      status: FeeStatus.UN_PAID,
    });
    const paidFee: Fee = Object.assign(new Fee(), {
      status: FeeStatus.PAID,
    });

    jest
      .spyOn(feeRepository, 'find')
      .mockImplementationOnce(async () => [unPaidFee, unPaidFee, paidFee]);

    const fees: any = await handler.execute(
      new ListFeesQuery(faker.random.uuid()),
    );

    expect(fees[0]).toBeInstanceOf(ListableFeeDto);
  });
});
