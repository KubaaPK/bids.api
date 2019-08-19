import { Provider } from '@nestjs/common';
import { EntityManager } from 'typeorm';

export const entityManagerStub: Provider<any> = {
  provide: EntityManager,
  useValue: {
    getRepository: jest.fn().mockReturnThis(),
  },
};
