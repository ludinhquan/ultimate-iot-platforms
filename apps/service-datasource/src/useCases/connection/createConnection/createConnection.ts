import {Logger} from "@iot-platforms/common";
import {Either, left, Result, right, UniqueEntityID, UseCase} from "@iot-platforms/core";
import {IDataSourceRepository} from "apps/service-datasource/src/data-access";
import {DatasourceId, DeviceKey} from "apps/service-datasource/src/domain";
import {CreateConnectionDTO} from "./createConnectionDTO";
import {CreateConnectionErrors} from "./createConnectionErrors";

type CreateConnectionResponse = Either<
  CreateConnectionErrors.DeviceKeyIsInvalid |
  Result<any>,
  Result<any>
>

export class CreateConnectionUseCase implements UseCase<CreateConnectionDTO, CreateConnectionResponse> {
  private logger = new Logger(this.constructor.name)

  constructor(
    private datasourceRepo: IDataSourceRepository
  ) {}

  async execute(dto: CreateConnectionDTO): Promise<CreateConnectionResponse> {
    const listKeys = dto.items.map(item => item.deviceKey);
    const deviceKeyOrError = Result.combine(listKeys.map(key => DeviceKey.create({value: key})));

    if (deviceKeyOrError.isFailure) return left(deviceKeyOrError)

    const devices = this.getDevices(dto)

    return right(Result.ok())
  }

  async getDevices(dto: CreateConnectionDTO) {
    type GroupDevice = Record<string, CreateConnectionDTO['items']>

    const groupedItemsByDatasourceId = dto.items.reduce(
      (prev: GroupDevice, item) => ({
        ...prev,
        [item.datasourceId]: [...(prev[item.datasourceId] ?? []), item]
      }),
      {}
    )

    const datasourceIds = Object.keys(groupedItemsByDatasourceId)
      .map(id => DatasourceId.create(new UniqueEntityID(id)).getValue());

    const deviceGroups = await Promise.all(
      datasourceIds.map(datasourceId => this.datasourceRepo.getDevicesByDatasourceId(datasourceId))
    )

    console.log(deviceGroups)
    // return groupDeviceKeysByDatasource
  }
}
