import { Test, TestingModule } from '@nestjs/testing';
import { ServiceDatasourceController } from './service-datasource.controller';
import { ServiceDatasourceService } from './service-datasource.service';

describe('ServiceDatasourceController', () => {
  let serviceDatasourceController: ServiceDatasourceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ServiceDatasourceController],
      providers: [ServiceDatasourceService],
    }).compile();

    serviceDatasourceController = app.get<ServiceDatasourceController>(ServiceDatasourceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(serviceDatasourceController.getHello()).toBe('Hello World!');
    });
  });
});
