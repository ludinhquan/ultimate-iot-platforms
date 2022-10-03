import {ServiceRegistryModule} from "@iot-platforms/core";
import {DataAccessModule} from "@iot-platforms/data-access";
import {Module} from "@nestjs/common";
import {DatasourceService} from "./domain";
import {DatasourceAddNewDevicesController, CreateDatasourceController} from "./useCases/datasource";

const datasourceControllers = [
    CreateDatasourceController,
    DatasourceAddNewDevicesController
]

@Module({
  imports: [
    ServiceRegistryModule,
    DataAccessModule
  ],
  providers: [
    DatasourceService
  ],
  controllers: [
    ...datasourceControllers
  ]
})
export class AppModule { }
