import {EventBusModule} from '@iot-platforms/event-bus';
import { Module } from '@nestjs/common';
import {UpdateDataLogHandler} from './handlers';

const handlers = [
  UpdateDataLogHandler
]

@Module({
  imports: [
    EventBusModule.register({
      name: 'ServiceDataLog',
      handlers: [UpdateDataLogHandler]
    })
  ],
  controllers: [],
  providers: [...handlers],
})
export class AppModule {}

