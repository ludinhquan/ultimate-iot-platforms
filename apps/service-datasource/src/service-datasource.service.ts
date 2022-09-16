import { Injectable } from '@nestjs/common';

@Injectable()
export class ServiceDatasourceService {
  getHello(): string {
    return 'Hello World!  3';
  }
}
