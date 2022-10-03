import {Either, left, Result, right, UseCase} from "@iot-platforms/core";
import {IDataSourceRepository} from "@iot-platforms/data-access";
import {DatasourceKey, Device, DeviceKey} from "apps/service-datasource/src/domain";
import {AddNewDevicesDTO} from "./addNewDevicesDTO";
import {AddNewDevicesErrors} from "./addNewDevicesErrors";

type AddNewDevicesResponse = Either<
  AddNewDevicesErrors.DatasourceDontExists |
  Result<any>,
  null
>

export class AddNewDevices implements UseCase<AddNewDevicesDTO, Promise<AddNewDevicesResponse>>{
  private datasourceRepo: IDataSourceRepository

  constructor(datasourceRepo: IDataSourceRepository) {
    this.datasourceRepo = datasourceRepo
  }

  async execute(data: AddNewDevicesDTO): Promise<AddNewDevicesResponse> {

    const keyOrError = DatasourceKey.create({value: data.datasourceKey})
    if (keyOrError.isFailure) return left(keyOrError)
    const datasourceKey = keyOrError.getValue()

    const datasource = await this.datasourceRepo.findByKey(datasourceKey);
    if (!datasource) return left(new AddNewDevicesErrors.DatasourceDontExists(data.datasourceKey));

    const devices = await this.datasourceRepo.getDevicesByDatasourceId(datasource.datasourceId);

    const newDevices = data.devices
    .filter(key => !devices.exists(key))
    .map(
      key => Device.create({
        key: DeviceKey.create({value: key}).getValue(),
        datasourceId: datasource.datasourceId,
      }).getValue(),
    );

    console.log(newDevices)

    return right(null)
  }
}
