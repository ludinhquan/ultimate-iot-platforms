import {CommonModule} from '@iot-platforms/common';
import { Module } from '@nestjs/common';
import { ServiceDatasourceController } from './service-datasource.controller';
import { ServiceDatasourceService } from './service-datasource.service';


@Module({
  imports: [CommonModule],
  controllers: [ServiceDatasourceController],
  providers: [ServiceDatasourceService],
})
export class ServiceDatasourceModule {}
