import { ListOfferHandler } from './list-offer.handler';
import { OfferRepository } from '../../../../domain/offer/offer.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { ioCContainer } from '../../../../../../config/ioc-container';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ListOfferQuery } from './list-offer.query';
import * as faker from 'faker';
import { Offer } from '../../../../domain/offer/offer';
import { ListableSingleOfferDto } from '../../../dtos/read/offer/listable-single-offer.dto';
import { EntityManager } from 'typeorm';
import { AccountInformationService } from '../../../../../account/application/services/account-information/account-information.service';

describe('List Item Handler', () => {
  let handler: ListOfferHandler;
  let offerRepository: OfferRepository;
  let accountInformationService: AccountInformationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListOfferHandler,
        ...ioCContainer,
        AccountInformationService,
        {
          provide: EntityManager,
          useValue: {
            getRepository: jest.fn().mockReturnThis(),
          },
        },
      ],
    }).compile();

    handler = module.get(ListOfferHandler);
    offerRepository = module.get(OfferRepository);
    accountInformationService = module.get(AccountInformationService);
  });

  it('should List Item Handler be defined', async () => {
    expect(handler).toBeDefined();
  });

  it('should Item Repository be defined', async () => {
    expect(offerRepository).toBeDefined();
  });

  it('should Account Infromation Service be defined', async () => {
    expect(accountInformationService).toBeDefined();
  });

  it('should throw Internal Server Error Exception if selecting offer from Postgres fails', async () => {
    jest.spyOn(offerRepository, 'findOne').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    await expect(
      handler.execute(new ListOfferQuery(faker.random.uuid())),
    ).rejects.toThrowError(InternalServerErrorException);
  });

  it('should return Not Found Exception if offer with given id does not exist in Postgres', async () => {
    jest
      .spyOn(offerRepository, 'findOne')
      .mockImplementationOnce(() => undefined);

    await expect(
      handler.execute(new ListOfferQuery(faker.random.uuid())),
    ).rejects.toThrowError(NotFoundException);
  });

  it('should return Listable Single Item Dto', async () => {
    jest.spyOn(offerRepository, 'findOne').mockImplementationOnce(async () =>
      Object.assign(new Offer(), {
        description: '[]',
        images: [],
        shippingRate: {},
        customer: {
          id: faker.random.uuid(),
        },
      }),
    );
    jest
      .spyOn(accountInformationService, 'getUsername')
      .mockImplementationOnce(async () => 'john_doe_22');

    const offer: ListableSingleOfferDto = await handler.execute(
      new ListOfferQuery(faker.random.uuid()),
    );

    expect(offer).toBeInstanceOf(ListableSingleOfferDto);
  });
});
