import {ServiceRegistryModule} from "@iot-platforms/core";
import {DataReceivedEvent, EventBusModule, RawDataReceivedEvent} from "@iot-platforms/event-bus";
import {Module} from "@nestjs/common";
import {DataAccessModule} from "./dataAccess";
import {
  CreateConnectionController,
  GetConnectionController,
  UpdateDataLogHandler,
  PushDataController, 
} from "./useCases";

const datasourceControllers = [
  CreateConnectionController,
  GetConnectionController
]

const fakeDataController = [
  PushDataController
]

const handlers = [
  UpdateDataLogHandler
]

@Module({
  imports: [
    ServiceRegistryModule,
    DataAccessModule,
    EventBusModule.register({
      name: 'ServiceDatasource',
      events: [RawDataReceivedEvent, DataReceivedEvent],
      handlers: [UpdateDataLogHandler]
    })
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
