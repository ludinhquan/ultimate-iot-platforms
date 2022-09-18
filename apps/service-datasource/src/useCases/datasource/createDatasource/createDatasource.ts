import {Either, left, Result, right, UseCase} from "@iot-platforms/core";
import {Datasource, DatasourceKey, Device, DeviceKey, Devices} from "../../../domain";
import {CreateDatasourceDTO} from "./createDatasourceDTO";

type Response = Either<
  Result<any>,
  Result<void>
>

interface IDatasourceRepo {
  exists(query: {key?: string, datasourceId?: string}): Promise<boolean>
  save(datasource: Datasource): Promise<boolean>
}

export class CreateDatasource implements UseCase<CreateDatasourceDTO, Promise<Response>>{
  private datasourceRepo: IDatasourceRepo

  async execute(request: CreateDatasourceDTO): Promise<Response> {
    const {datasourceKey} = request
    const existed = this.datasourceRepo.exists({key: datasourceKey});
    if(existed) left(Result.fail(`Datasource with key ${datasourceKey} has been created`))

    const keyOrError = DatasourceKey.create({value: request.datasourceKey})
    if(keyOrError.isFailure) return left(keyOrError)

    const datasourceOrError = Datasource.create({
      key: keyOrError.getValue()
    })

    if(datasourceOrError.isFailure) return left(datasourceOrError)
    const datasource = datasourceOrError.getValue()

    const devices = request.devices.map(key => Device.create({
      key: DeviceKey.create({value: key}).getValue(),
      datasourceId: datasource.datasourceId,
    }).getValue())
    
    datasource.addDevices(Devices.create(devices))

    await this.datasourceRepo.save(datasource)

    return right(Result.ok())
  }
}
