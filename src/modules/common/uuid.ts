import * as uuid from 'uuid';

export class Uuid {
  public static v4(): Uuid {
    return uuid.v4();
  }
}
