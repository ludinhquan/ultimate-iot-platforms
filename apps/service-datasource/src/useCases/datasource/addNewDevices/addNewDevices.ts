import {Either, left, Result, right, UseCase} from "@iot-platforms/core";
import {IDataSourceRepository} from "@iot-platforms/data-access";
import {Datasource, DatasourceKey, Device, DeviceKey, Devices} from "apps/service-datasource/src/domain";
import {AddNewDevicesDTO} from "./addNewDevicesDTO";
import {AddNewDevicesErrors} from "./addNewDevicesErrors";

type AddNewDevicesResponse = Either<
  AddNewDevicesErrors.DatasourceDontExists |
  AddNewDevicesErrors.DeviceKeyIsInvalid |
  Result<any>,
  null
>

export class AddNewDevicesUseCase implements UseCase<AddNewDevicesDTO, Promise<AddNewDevicesResponse>>{
  constructor(
    private datasourceRepo: IDataSourceRepository,
  ) {}

  async getDevicesFromDTO(datasource: Datasource, deviceKeys: string[]): Promise<Result<Devices>> {
    const oldDevices = await this.datasourceRepo.getDevicesByDatasourceId(datasource.datasourceId);
    const deviceKeysError = deviceKeys
      .map(key => DeviceKey.create({value: key}))

    const result = Result.combine(deviceKeysError);

    if(result.isFailure) return Result.fail('Invalid key');

    const list = deviceKeysError
      .filter(key => !oldDevices.exists(key.getValue().value))
      .map(
        key => Device.create({
          key: key.getValue(),
          datasourceId: datasource.datasourceId,
        }).getValue(),
      );

    const devicesOrError = Devices.create(list);
    return devicesOrError
  }

  async execute(data: AddNewDevicesDTO): Promise<AddNewDevicesResponse> {
    const keyOrError = DatasourceKey.create({value: data.datasourceKey})
    if (keyOrError.isFailure) return left(keyOrError)
    const datasourceKey = keyOrError.getValue()

    const datasource = await this.datasourceRepo.findByKey(datasourceKey);
    if (!datasource) return left(new AddNewDevicesErrors.DatasourceDontExists(data.datasourceKey));

    const devicesOrError = await this.getDevicesFromDTO(datasource, data.devices);
    if(devicesOrError.isFailure)
      return left(new AddNewDevicesErrors.DeviceKeyIsInvalid(devicesOrError.getError()))

    datasource.updateDevices(devicesOrError.getValue())
    await this.datasourceRepo.save(datasource)

    return right(null)
  }
}
