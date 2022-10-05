import {Result} from "@iot-platforms/core";
import {EventBusHandler, IEventHandler, RawDataReceivedEvent} from "@iot-platforms/event-bus";
import {RepositoryManager} from "../data-access";

@EventBusHandler({event: RawDataReceivedEvent})
export class RawDataReceivedEventHandler implements IEventHandler<RawDataReceivedEvent>{
  constructor(
    private repoManager: RepositoryManager
  ) {}

  async handle(event: RawDataReceivedEvent) {
    const tentantId = event.getOrganizationId()
    const [datasourceRepo, systemDeviceRepo] = await Promise.all([
      this.repoManager.datasourceRepo(tentantId),
      this.repoManager.systemDeviceRepo(tentantId)
    ]);

    console.log(await datasourceRepo.find())

    return Result.ok();
  }
}
