import 'dotenv/config';
import { NestApplication, NestFactory } from '@nestjs/core';
import * as helmet from 'helmet';
import { AppModule } from './app.module';
import { ValidationPipe } from './modules/common/pipes/validation.pipe';
import {
  DocumentBuilder,
  SwaggerBaseConfig,
  SwaggerDocument,
  SwaggerModule,
} from '@nestjs/swagger';

async function bootstrap(): Promise<void> {
  const app: NestApplication = await NestFactory.create(AppModule);
  app.use(helmet());
  app.setGlobalPrefix(process.env.APP_API_PREFIX);
  app.useGlobalPipes(new ValidationPipe());

  const options: SwaggerBaseConfig = new DocumentBuilder()
    .setTitle('Bids.')
    .setDescription('The Bids API documentation.')
    .setVersion('1.0')
    .build();
  const document: SwaggerDocument = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/v1/docs', app, document);

  await app.listen(process.env.APP_PORT);
}
(async () => {
  await bootstrap();
})();
