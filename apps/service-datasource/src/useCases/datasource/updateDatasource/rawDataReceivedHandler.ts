import {MeasuringLogs, StatusDevice} from "@iot-platforms/contracts";
import {Result} from "@iot-platforms/core";
import {EventBusHandler, IEventHandler, RawDataReceivedEvent} from "@iot-platforms/event-bus";
import {Inject, Logger} from "@nestjs/common";
import {IRepositoryManager, RepositoryManager} from "@svc-datasource/dataAccess";
import {UpdateDatasourceUseCase} from "./updateDatasource";
import {UpdateDatasourceDTO} from "./updateDatasourceDTO";

@EventBusHandler({event: RawDataReceivedEvent})
export class RawDataReceivedEventHandler implements IEventHandler<RawDataReceivedEvent>{
  logger = new Logger(this.constructor.name)

  constructor(
    @Inject(RepositoryManager) private repoManager: IRepositoryManager,
  ) {}

  transformEventToDTO(event: RawDataReceivedEvent): UpdateDatasourceDTO{
    return {
      datasourceKey: event.datasourceKey,
      measuringLogs: Object.keys(event.measuringLogs)
        .reduce(
          (prev: MeasuringLogs, key) => ({
            ...prev,
            [key]: {
              value: Number(event.measuringLogs[key].value),
              statusDevice: Number(event.measuringLogs[key].statusDevice) as StatusDevice,
            }
          }), {}
        )
    }
  }

  async handle(event: RawDataReceivedEvent) {
    try {
      const tentantId = event.getOrganizationId()
      const [datasourceRepo, connectionRepo, systemDeviceRepo] = await Promise.all([
        this.repoManager.datasourceRepo(tentantId),
        this.repoManager.connectionRepo(tentantId),
        this.repoManager.systemDeviceRepo(tentantId)
      ]);

      const useCase = new UpdateDatasourceUseCase(
        datasourceRepo, 
        connectionRepo, 
        systemDeviceRepo
      )
      const dto = this.transformEventToDTO(event)
      const result = await useCase.execute(dto)

      if (result && result.isLeft()) {
        this.logger.error(result.value.toJson())
        return Result.ok()
      }

      return Result.ok();
    } catch (e) {
      this.logger.error(e, e.stack)
      return Result.ok()
    }

  }
}
