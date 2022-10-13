import {ServiceRegistryModule} from "@iot-platforms/core";
import {EventBusModule} from "@iot-platforms/event-bus";
import {Module} from "@nestjs/common";
import {DataAccessModule} from "./dataAccess";
import {
  CreateConnectionController,
  PushDataController, 
  RawDataReceivedEventHandler
} from "./useCases";

const datasourceControllers = [
  CreateConnectionController
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
    ...handlers
  ],
  controllers: [
    ...datasourceControllers,
    ...fakeDataController
  ]
})
export class AppModule {}
