import {Either, left, Result, right, UseCase} from "@iot-platforms/core";
import {IDataSourceRepository, ISystemDeviceRepository} from "@iot-platforms/data-access";
import {Datasource, DatasourceKey, DatasourceService, Device, DeviceKey, Devices} from "apps/service-datasource/src/domain";
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
    private systemDeviceRepo: ISystemDeviceRepository,
    private datasourceService: DatasourceService
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
    const datasourceKeyOrError = DatasourceKey.create({value: data.datasourceKey})
    if (datasourceKeyOrError.isFailure) return left(datasourceKeyOrError)
    const datasourceKey = datasourceKeyOrError.getValue()

    const datasource = await this.datasourceRepo.findByKey(datasourceKey);
    if (!datasource) return left(new AddNewDevicesErrors.DatasourceDontExists(data.datasourceKey));

    const devicesOrError = await this.getDevicesFromDTO(datasource, data.devices);
    if(devicesOrError.isFailure)
      return left(new AddNewDevicesErrors.DeviceKeyIsInvalid(devicesOrError.getError()))

    const devices = devicesOrError.getValue();
    const systemDevices = await this.systemDeviceRepo.findSystemDevicesByKeys(data.devices)

    this.datasourceService.mappingSystemKey(devices, systemDevices)

    datasource.updateDevices(devices);

    await this.datasourceRepo.save(datasource)

    return right(null)
  }
}
