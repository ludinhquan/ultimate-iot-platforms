import {HttpExceptionFilter, HttpInterceptor} from '@iot-platforms/common';
import {ValidationPipe} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';

Object.defineProperty(global, 'isDevelopment', {
  writable: false,
  configurable: false,
  enumerable: false,
  value: process.env.NODE_ENV === 'development',
})

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks()
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(new HttpInterceptor())
  
  await app.listen(process.env.SERVICE_DATASOURCE);
}
bootstrap();
