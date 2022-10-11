import {SerializeInterceptor} from '@iot-platforms/common';
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
  app.useGlobalInterceptors(new SerializeInterceptor())
  await app.listen(4000);
}
bootstrap();
