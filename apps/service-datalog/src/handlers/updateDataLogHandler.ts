import {Logger} from "@iot-platforms/common";
import {Result} from "@iot-platforms/core";
import {DataReceivedEvent, EventBusHandler, IEventHandler} from "@iot-platforms/event-bus";

@EventBusHandler({event: DataReceivedEvent})
export class UpdateDataLogHandler implements IEventHandler{
  private logger = new Logger(UpdateDataLogHandler.name)

  constructor(){}

  async handle(event: DataReceivedEvent) {
    console.log(event);

    return Result.ok()
  }
}
