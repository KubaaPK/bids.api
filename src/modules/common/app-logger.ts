import { Logger } from '@nestjs/common';

export class AppLogger extends Logger {
  constructor(context: string, isTimestampEnabled: boolean) {
    super(context, isTimestampEnabled);
  }
}
