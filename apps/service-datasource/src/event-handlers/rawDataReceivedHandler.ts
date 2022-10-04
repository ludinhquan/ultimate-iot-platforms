import {Result} from "@iot-platforms/core";
import {RepositoryManager} from "@iot-platforms/data-access/repo-manager.service";
import {EventBusHandler, IEventHandler, RawDataReceivedEvent} from "@iot-platforms/event-bus";

@EventBusHandler({event: RawDataReceivedEvent})
export class RawDataReceivedEventHandler implements IEventHandler<RawDataReceivedEvent>{
  constructor(
    private repoManager: RepositoryManager,
  ){}

  async handle(event: RawDataReceivedEvent) {
    const datasourceRepo = await this.repoManager.datasourceRepo(event.getOrganizationId());
    return Result.ok()
  }
}
