import {Result} from "@iot-platforms/core";
import {EventBusHandler, IEventHandler, RawDataReceivedEvent} from "@iot-platforms/event-bus";
import {Inject} from "@nestjs/common";
import {IRepositoryManager, RepositoryManager} from "../data-access";

@EventBusHandler({event: RawDataReceivedEvent})
export class RawDataReceivedEventHandler implements IEventHandler<RawDataReceivedEvent>{
  constructor(
    @Inject(RepositoryManager) private repoManager: IRepositoryManager,
  ) {}

  async handle(event: RawDataReceivedEvent) {
    const tentantId = event.getOrganizationId()
    const [datasourceRepo, systemDeviceRepo] = await Promise.all([
      this.repoManager.datasourceRepo(tentantId),
      this.repoManager.systemDeviceRepo(tentantId)
    ]);

    return Result.ok();
  }
}
