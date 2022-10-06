import {MeasuringLogs, StatusDevice} from "@iot-platforms/contracts";
import {Result} from "@iot-platforms/core";
import {EventBusHandler, IEventHandler, RawDataReceivedEvent} from "@iot-platforms/event-bus";
import {Inject, Logger} from "@nestjs/common";
import {IRepositoryManager, RepositoryManager} from "apps/service-datasource/src/data-access";
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
      datasourceKey: event.stationId,
      measuringLogs: event.measures
      .filter(item => !!item.parameter)
      .reduce(
        (prev: MeasuringLogs, item) => ({
          ...prev,
          [item.parameter]: {
            value: Number(item.value),
            statusDevice: Number(item.statusDevice) as StatusDevice,
          }
        }), {}
      )
    }
  }

  async handle(event: RawDataReceivedEvent) {
    try {
      const tentantId = event.getOrganizationId()
      const [datasourceRepo, systemDeviceRepo] = await Promise.all([
        this.repoManager.datasourceRepo(tentantId),
        this.repoManager.systemDeviceRepo(tentantId)
      ]);

      const useCase = new UpdateDatasourceUseCase(datasourceRepo, systemDeviceRepo)
      const dto = this.transformEventToDTO(event)
      const result = await useCase.execute(dto)

      if (result && result.isLeft()) {
        this.logger.error(result.value.getError())
        return Result.ok()
      }

      return Result.ok();
    } catch (e) {
      this.logger.error(e, e.stack)
      return Result.ok()
    }

  }
}