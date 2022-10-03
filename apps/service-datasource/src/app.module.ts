import {ServiceRegistryModule} from "@iot-platforms/core";
import {DataAccessModule} from "@iot-platforms/data-access";
import {Module} from "@nestjs/common";
import {DatasourceAddNewDevicesController, CreateDatasourceController} from "./useCases/datasource";

@Module({
  imports: [
    ServiceRegistryModule,
    DataAccessModule
  ],
  controllers: [CreateDatasourceController, DatasourceAddNewDevicesController]
})
export class AppModule { }
