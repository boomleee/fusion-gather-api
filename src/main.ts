/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import rawBodyMiddleware from './webhook/rawBody.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // app.use(cors());
  app.use(rawBodyMiddleware());

  await app.listen(process.env.PORT || 8080);
}
bootstrap();
