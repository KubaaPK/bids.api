import { PurchaseMadeHandler } from './purchase-made.handler';
import { OfferRepository } from '../../../domain/offer/offer.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { ioCContainer } from '../../../../../config/ioc-container';
import { EntityManager } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { Offer } from '../../../domain/offer/offer';
import { PurchaseMadeEvent } from './purchase-made.event';
import * as faker from 'faker';

describe('Purchase Made Handler', () => {
  let handler: PurchaseMadeHandler;
  let offerRepository: OfferRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchaseMadeHandler,
        ...ioCContainer,
        {
          provide: EntityManager,
          useValue: {
            getRepository: jest.fn().mockReturnThis(),
          },
        },
      ],
    }).compile();

    handler = module.get(PurchaseMadeHandler);
    offerRepository = module.get(OfferRepository);
  });

  it('should Purchase Made Handler be defined', async () => {
    expect(handler).toBeDefined();
  });

  it('should Offer Repository be defined', async () => {
    expect(offerRepository).toBeDefined();
  });

  it('should throw Internal Server Error if save updated offer to Postgres fails', async () => {
    jest.spyOn(offerRepository, 'save').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    await expect(
      handler.handle(
        new PurchaseMadeEvent(
          faker.random.uuid(),
          faker.random.uuid(),
          3,
          Object.assign(new Offer(), {
            stock: {
              available: 3,
            },
          }),
        ),
      ),
    ).rejects.toThrowError(InternalServerErrorException);
  });

  it('should not throw any error while saving updated offer to Postgres', async () => {
    jest.spyOn(offerRepository, 'save').mockImplementationOnce(() => undefined);

    await expect(
      handler.handle(
        new PurchaseMadeEvent(
          faker.random.uuid(),
          faker.random.uuid(),
          3,
          new Offer(),
        ),
      ),
    ).resolves;
  });
});
