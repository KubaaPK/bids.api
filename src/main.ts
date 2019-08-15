import 'dotenv/config';
import { NestApplication, NestFactory } from '@nestjs/core';
import * as helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app: NestApplication = await NestFactory.create(AppModule);

  app.use(helmet());
  app.setGlobalPrefix(process.env.APP_API_PREFIX);

  await app.listen(process.env.APP_PORT);
}
(async () => {
  await bootstrap();
})();
