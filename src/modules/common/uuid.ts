import * as uuid from 'uuid';

export class Uuid {
  public static v4(): Uuid {
    return uuid.v4();
  }

  public static isUuidV4(candidate: any): boolean {
    const uuidV4Regexp: RegExp = /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/;
    return uuidV4Regexp.test(candidate);
  }
}
