import { ConflictException } from '@nestjs/common';

export class AccountAlreadyExistsException extends ConflictException {
  constructor() {
    super('Konto o podanym adresie email lub nazwie użytkownika już istnieje.');
  }
}
