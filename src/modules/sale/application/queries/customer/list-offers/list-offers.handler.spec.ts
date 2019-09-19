import { Test, TestingModule } from '@nestjs/testing';
import { ListOffersHandler } from './list-offers.handler';
import { OfferRepository } from '../../../../domain/offer/offer.repository';
import { ioCContainer } from '../../../../../../config/ioc-container';
import { EntityManager } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { ListOffersQuery } from './list-offers.query';
import { Offer } from '../../../../domain/offer/offer';
import { ListableOfferDto } from '../../../dtos/read/offer/listable-offer.dto';
import { Category } from '../../../../domain/category/category';
import { ShippingRate } from '../../../../domain/customer/shipping-rate/shipping-rate';
import { Customer } from '../../../../domain/customer/customer';

describe('List Offers Handler', () => {
  let handler: ListOffersHandler;
  let offerRepository: OfferRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListOffersHandler,
        ...ioCContainer,
        {
          provide: EntityManager,
          useValue: {
            getRepository: jest.fn().mockReturnThis(),
          },
        },
      ],
    }).compile();

    handler = module.get(ListOffersHandler);
    offerRepository = module.get(OfferRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should List Offer Handler be defined', async () => {
    expect(handler).toBeDefined();
  });

  it('should Offer Repository be defined', async () => {
    expect(offerRepository).toBeDefined();
  });

  it('should throw Internal Server Error Exception if selecting offers from database fails', async () => {
    jest.spyOn(offerRepository, 'find').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    await expect(handler.execute(new ListOffersQuery())).rejects.toThrowError(
      InternalServerErrorException,
    );
  });

  it('should return array with Listable Offer Dto', async () => {
    jest.spyOn(offerRepository, 'find').mockImplementationOnce(async () => [
      Object.assign(new Offer(), {
        description: {},
        images: [],
      }),
      Object.assign(new Offer(), {
        description: {},
        images: [],
      }),
    ]);

    const offers: ListableOfferDto = await handler.execute(
      new ListOffersQuery(),
    );
    expect(offers).toHaveLength(2);
    expect(offers[0]).toBeInstanceOf(ListableOfferDto);
  });
});
