import { Controller, Get } from '@nestjs/common';
import { ServiceDatasourceService } from './service-datasource.service';

@Controller()
export class ServiceDatasourceController {
  constructor(private readonly serviceDatasourceService: ServiceDatasourceService) {}

  @Get()
  getHello(): string {
    return this.serviceDatasourceService.getHello();
  }
}
