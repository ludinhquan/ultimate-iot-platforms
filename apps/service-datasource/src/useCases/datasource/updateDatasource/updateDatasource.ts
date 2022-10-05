import {Either, left, Result, UseCase} from "@iot-platforms/core";
import {Logger} from "@nestjs/common";
import {IDataSourceRepository, ISystemDeviceRepository} from "apps/service-datasource/src/data-access";
import {Datasource, DatasourceKey, DatasourceService, Device, DeviceKey, Devices} from "apps/service-datasource/src/domain";
import {UpdateDatasourceDTO} from "./updateDatasourceDTO";

type UpdateDatasourceResponse = Either<
  Result<any>,
  void
>

export class UpdateDatasourceUseCase implements UseCase<UpdateDatasourceDTO, UpdateDatasourceResponse> {
  private logger = new Logger(this.constructor.name)
  private datasourceService = new DatasourceService()

  constructor(
    private datasourceRepo: IDataSourceRepository,
    private systemRepo: ISystemDeviceRepository,
  ){}

  async execute(dto: UpdateDatasourceDTO): Promise<UpdateDatasourceResponse> {
    const datasourceKeyOrError = DatasourceKey.create({value: dto.datasourceKey});
    if(datasourceKeyOrError.isFailure) return left(datasourceKeyOrError)

    const datasourceKey = datasourceKeyOrError.getValue();
    const deviceKeys = Object.keys(dto.measuringLogs);

    const [datasource, systemDevices] = await Promise.all([
      this.getDatasource(datasourceKey),
      this.systemRepo.findSystemDevicesByKeys(deviceKeys),
    ]);

    const devices = await this.getNewDevices(datasource, deviceKeys)

    this.datasourceService.mappingSystemKey(devices, systemDevices);

    datasource.updateDevices(devices);
    await this.datasourceRepo.save(datasource)
    return  
  }

  async getDatasource(datasourceKey: DatasourceKey){
    const datasource = await this.datasourceRepo.findByKey(datasourceKey)
    if(!datasource) return Datasource.create({key: datasourceKey}).getValue()
    return datasource
  }

  async getNewDevices(datasource: Datasource, deviceKeys: string[]): Promise<Devices> {
    const datasourceId = datasource.datasourceId
    const oldDevices = await this.datasourceRepo.getDevicesByDatasourceId(datasourceId);

    const listDeviceKeyOrError = deviceKeys
      .filter(key => !oldDevices.exists(key))
      .map(key => DeviceKey.create({value: key}))
      .filter(deviceKey => deviceKey.isSuccess)

    const listDevice = listDeviceKeyOrError.map(keyResult => {
      return Device.create({
        key: keyResult.getValue(),
        datasourceId
      }).getValue()
    })

    return Devices.create(listDevice).getValue()
  }
}
