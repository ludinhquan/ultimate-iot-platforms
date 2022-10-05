import {Result} from "@iot-platforms/core";
import {EventBusHandler, IEventHandler, RawDataReceivedEvent} from "@iot-platforms/event-bus";
import {DatasourceService} from "../domain";

@EventBusHandler({event: RawDataReceivedEvent})
export class RawDataReceivedEventHandler implements IEventHandler<RawDataReceivedEvent>{
  constructor(
    private datasourceService: DatasourceService,
  ) {}

  async handle(event: RawDataReceivedEvent) {
    // const tentantId = event.getOrganizationId()
    // const [datasourceRepo, systemDeviceRepo] = await Promise.all([
    //   this.repoManager.datasourceRepo(tentantId),
    //   this.repoManager.systemDeviceRepo(tentantId)
    // ]);

    return Result.ok();
  }
}
