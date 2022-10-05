import {ServiceRegistryModule} from "@iot-platforms/core";
import {EventBusModule} from "@iot-platforms/event-bus";
import {Module} from "@nestjs/common";
import {DataAccessModule} from "./data-access";
import {DatasourceService} from "./domain";
import {RawDataReceivedEventHandler} from "./event-handlers";
import {PushDataController} from "./useCases/data/pushData/pushDataController";
import {CreateDatasourceController, DatasourceAddNewDevicesController} from "./useCases/datasource";

const datasourceControllers = [
  CreateDatasourceController,
  DatasourceAddNewDevicesController
]

const fakeDataController = [
  PushDataController
]

const handlers = [
  RawDataReceivedEventHandler
]

@Module({
  imports: [
    ServiceRegistryModule,
    DataAccessModule,
    EventBusModule
  ],
  providers: [
    DatasourceService,
    ...handlers
  ],
  controllers: [
    ...datasourceControllers,
    ...fakeDataController
  ]
})
export class AppModule { }
