import { NestFactory } from '@nestjs/core';
import { ServiceDatasourceModule } from './service-datasource.module';

async function bootstrap() {
  const app = await NestFactory.create(ServiceDatasourceModule);
  await app.listen(4000);
}
bootstrap();
