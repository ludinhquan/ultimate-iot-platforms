import {Logger} from "@iot-platforms/common";
import {Result} from "@iot-platforms/core";
import {DataReceivedEvent, EventBusHandler, IEventHandler} from "@iot-platforms/event-bus";
import {IDataLogRepository} from "@svc-datalog/dataAccess";

@EventBusHandler({event: DataReceivedEvent})
export class UpdateDataLogHandler implements IEventHandler{
  private logger = new Logger(UpdateDataLogHandler.name)

  constructor(
    private dataLogRepo: IDataLogRepository
  ) {}

  async handle(event: DataReceivedEvent) {
    console.log(event);

    return Result.ok()
  }
}
