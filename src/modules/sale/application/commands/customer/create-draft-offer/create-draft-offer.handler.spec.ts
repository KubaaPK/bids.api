import { Test, TestingModule } from '@nestjs/testing';
import { CreateDraftOfferHandler } from './create-draft-offer.handler';
import { CustomerRepository } from '../../../../domain/customer/customer.repository';
import { OfferRepository } from '../../../../domain/offer/offer.repository';
import { ioCContainer } from '../../../../../../config/ioc-container';
import { EntityManager } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { NewDraftOfferDto } from '../../../dtos/write/offer/new-draft-offer.dto';
import * as faker from 'faker';
import * as admin from 'firebase-admin';
import { CreateDraftOfferCommand } from './create-draft-offer.command';

describe('Create Draft Offer Handler', () => {
  let handler: CreateDraftOfferHandler;
  let customerRepository: CustomerRepository;
  let offerRepository: OfferRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateDraftOfferHandler,
        ...ioCContainer,
        {
          provide: EntityManager,
          useValue: {
            getRepository: jest.fn().mockReturnThis(),
          },
        },
      ],
    }).compile();

    handler = module.get(CreateDraftOfferHandler);
    customerRepository = module.get(CustomerRepository);
    offerRepository = module.get(OfferRepository);
  });

  it('should Create Draft Offer Handler be defined', async () => {
    expect(handler).toBeDefined();
  });

  it('should Customer Repository be defined', async () => {
    expect(customerRepository).toBeDefined();
  });

  it('should Offer Repository be defined', async () => {
    expect(offerRepository).toBeDefined();
  });

  it('should throw Internal Server Error if selecting customer from Postgres fails', async () => {
    jest.spyOn(customerRepository, 'findOne').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    const newDraftOffer: NewDraftOfferDto = {
      name: 'Test offer',
      customer: {
        uid: faker.random.uuid(),
      } as admin.auth.DecodedIdToken,
    };

    await expect(
      handler.execute(new CreateDraftOfferCommand(newDraftOffer)),
    ).rejects.toThrowError(InternalServerErrorException);
  });
});
