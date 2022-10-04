import {Either, left, Result, right, UseCase} from "@iot-platforms/core";
import {IDataSourceRepository} from "@iot-platforms/data-access";
import {Datasource, DatasourceKey, Device, DeviceKey, Devices} from "../../../domain";
import {CreateDatasourceDTO} from "./createDatasourceDTO";
import {CreateDatasourceErrors} from "./createDatasourceErrors";

type CreateDatasourceResponse = Either<
  CreateDatasourceErrors.DatasourceAlreadyExist | 
  Result<any>,
  Datasource
>


export class CreateDatasourceUseCase implements UseCase<CreateDatasourceDTO, Promise<CreateDatasourceResponse>>{
  private datasourceRepo: IDataSourceRepository
  constructor(datasourceRepo: IDataSourceRepository) {
    this.datasourceRepo = datasourceRepo
  }

  async getDevicesFromDTO(datasource: Datasource, deviceKeys: string[]){
    const newDevices = deviceKeys
    .map(
      key => Device.create({
        key: DeviceKey.create({value: key}).getValue(),
        datasourceId: datasource.datasourceId,
      }).getValue(),
    );
    
    const devicesOrError = Devices.create(newDevices)
    return devicesOrError
  }

  async execute(data: CreateDatasourceDTO): Promise<CreateDatasourceResponse> {
    const {datasourceKey} = data

    const keyOrError = DatasourceKey.create({value: datasourceKey})
    if(keyOrError.isFailure) return left(keyOrError)

    const existed = await this.datasourceRepo.existByKey(keyOrError.getValue());
    if (existed) return left(new CreateDatasourceErrors.DatasourceAlreadyExist(datasourceKey))

    const datasourceOrError = Datasource.create({
      key: keyOrError.getValue()
    })

    if(datasourceOrError.isFailure) return left(datasourceOrError)
    const datasource = datasourceOrError.getValue()

    const devices = await this.getDevicesFromDTO(datasource, data.devices)
    if(devices.isFailure) return left(new CreateDatasourceErrors.DeviceKeyIsDuplicate())

    datasource.updateDevices(devices.getValue());
    await this.datasourceRepo.save(datasource)

    return right(datasource)
  }
}
