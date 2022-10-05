import {Either, left, Result, right, UseCase} from "@iot-platforms/core";
import {IDataSourceRepository} from "apps/service-datasource/src/data-access/interfaces";
import {Datasource, DatasourceKey, Device, DeviceKey, Devices} from "../../../domain";
import {CreateDatasourceDTO} from "./createDatasourceDTO";
import {CreateDatasourceErrors} from "./createDatasourceErrors";

type CreateDatasourceResponse = Either<
  CreateDatasourceErrors.DatasourceAlreadyExist | 
  Result<any>,
  Datasource
>

export class CreateDatasourceUseCase implements UseCase<CreateDatasourceDTO, Promise<CreateDatasourceResponse>>{
  constructor(private datasourceRepo: IDataSourceRepository) {}

  async getDevicesFromDTO(datasource: Datasource, deviceKeys: string[]){
    const deviceKeysError = deviceKeys
      .map(key => DeviceKey.create({value: key}))

    const result = Result.combine(deviceKeysError);

    if(result.isFailure) return Result.fail<Devices>('Invalid key');

    const list = deviceKeysError
      .map(
        key => Device.create({
          key: key.getValue(),
          datasourceId: datasource.datasourceId,
        }).getValue(),
      );
    
    const devicesOrError = Devices.create(list)
    return devicesOrError
  }

  async execute(data: CreateDatasourceDTO): Promise<CreateDatasourceResponse> {
    const {datasourceKey} = data
    const keyOrError = DatasourceKey.create({value: datasourceKey})
    if(keyOrError.isFailure) 
      return left(keyOrError)

    const existed = await this.datasourceRepo.existByKey(keyOrError.getValue());
    if (existed) return left(new CreateDatasourceErrors.DatasourceAlreadyExist(datasourceKey))

    const datasourceOrError = Datasource.create({
      key: keyOrError.getValue()
    })

    if(datasourceOrError.isFailure) return left(datasourceOrError)

    const datasource = datasourceOrError.getValue()

    const devices = await this.getDevicesFromDTO(datasource, data.devices)
    if(devices.isFailure) return left(new CreateDatasourceErrors.DeviceKeyIsInvalid(devices.getError()))

    datasource.updateDevices(devices.getValue());
    await this.datasourceRepo.save(datasource)

    return right(datasource)
  }
}
