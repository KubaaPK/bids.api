import { Test, TestingModule } from '@nestjs/testing';
import { RequestOfferPublicationHandler } from './request-offer-publication.handler';
import { CustomerRepository } from '../../../../domain/customer/customer.repository';
import { ioCContainer } from '../../../../../../config/ioc-container';
import { EntityManager } from 'typeorm';
import {
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { RequestOfferPublicationCommand } from './request-offer-publication.command';
import faker = require('faker');
import { Customer } from '../../../../domain/customer/customer';
import { Offer } from '../../../../domain/offer/offer';
import { DraftOfferValidator } from '../../../services/draft-offer-validator/draft-offer-validator';

describe('Request Item Publication Handler', () => {
  let handler: RequestOfferPublicationHandler;
  let customerRepository: CustomerRepository;
  let draftOfferValidator: DraftOfferValidator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestOfferPublicationHandler,
        DraftOfferValidator,
        ...ioCContainer,
        {
          provide: EntityManager,
          useValue: {
            getRepository: jest.fn().mockReturnThis(),
          },
        },
      ],
    }).compile();

    handler = module.get(RequestOfferPublicationHandler);
    customerRepository = module.get(CustomerRepository);
    draftOfferValidator = module.get(DraftOfferValidator);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should Request Item Publication Handler be defined', async () => {
    expect(handler).toBeDefined();
  });

  it('should Customer Repository be defined', async () => {
    expect(customerRepository).toBeDefined();
  });

  it('should Draft Item Validator be defined', async () => {
    expect(draftOfferValidator).toBeDefined();
  });

  it('should throw Internal Server Error Exception if selecting customer from Postgres fails', async () => {
    jest.spyOn(customerRepository, 'findOne').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });

    await expect(
      handler.execute(
        new RequestOfferPublicationCommand(
          faker.random.uuid(),
          faker.random.uuid(),
        ),
      ),
    ).rejects.toThrowError(InternalServerErrorException);
  });

  it('should throw Not Found Exception if offer with given id does not exist in Postgres', async () => {
    jest.spyOn(customerRepository, 'findOne').mockImplementationOnce(async () =>
      Object.assign(new Customer(), {
        offers: new Promise(resolve => resolve([])),
      }),
    );

    await expect(
      handler.execute(
        new RequestOfferPublicationCommand(
          faker.random.uuid(),
          faker.random.uuid(),
        ),
      ),
    ).rejects.toThrowError(NotFoundException);
  });

  it('should throw Unprocessable Entity Exception if draft offer validation fails', async () => {
    const existingOfferId = faker.random.uuid();

    jest.spyOn(customerRepository, 'findOne').mockImplementationOnce(async () =>
      Object.assign(new Customer(), {
        offers: new Promise(resolve =>
          resolve([Object.assign(new Offer(), { id: existingOfferId })]),
        ),
      }),
    );
    jest
      .spyOn(draftOfferValidator, 'validate')
      .mockImplementationOnce(async () => ['errors']);

    await expect(
      handler.execute(
        new RequestOfferPublicationCommand(
          faker.random.uuid(),
          existingOfferId,
        ),
      ),
    ).rejects.toThrowError(UnprocessableEntityException);
  });

  it('should throw Internal Server Error Exception if saving customer to Postgres fails', async () => {
    const existingOfferId = faker.random.uuid();

    jest.spyOn(customerRepository, 'findOne').mockImplementationOnce(async () =>
      Object.assign(new Customer(), {
        offers: new Promise(resolve =>
          resolve([Object.assign(new Offer(), { id: existingOfferId })]),
        ),
      }),
    );
    jest.spyOn(customerRepository, 'save').mockImplementationOnce(() => {
      throw new InternalServerErrorException();
    });
    jest
      .spyOn(draftOfferValidator, 'validate')
      .mockImplementationOnce(async () => []);

    await expect(
      handler.execute(
        new RequestOfferPublicationCommand(
          faker.random.uuid(),
          existingOfferId,
        ),
      ),
    ).rejects.toThrowError(InternalServerErrorException);
  });
});
