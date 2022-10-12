import {Either, left, Result, UseCase} from "@iot-platforms/core";
import {IConnectionRepository, IDataSourceRepository, ISystemDeviceRepository} from "@svc-datasource/dataAccess";
import {Connection, ConnectionItem, ConnectionItems, Datasource, DatasourceKey, DatasourceService, Device, DeviceKey, Devices} from "@svc-datasource/domain";
import {UpdateDatasourceDTO} from "./updateDatasourceDTO";
import {UpdateDatasourceErrors as Errors} from "./updateDatasourceError";

type UpdateDatasourceResponse<T = void> = Either<
  Errors.UpdateDatasourceBadRequest,
  Result<T>
>

export class UpdateDatasourceUseCase implements UseCase<UpdateDatasourceDTO, UpdateDatasourceResponse> {
  private datasourceService = new DatasourceService()

  constructor(
    private datasourceRepo: IDataSourceRepository,
    private connectionRepo: IConnectionRepository,
    private systemRepo: ISystemDeviceRepository,
  ){}

  async execute(dto: UpdateDatasourceDTO): Promise<UpdateDatasourceResponse> {
    const datasourceKeyOrError = DatasourceKey.create({value: dto.datasourceKey});
    if(datasourceKeyOrError.isFailure) 
      return left(new Errors.UpdateDatasourceBadRequest(datasourceKeyOrError.getError()))

    const datasourceKey = datasourceKeyOrError.getValue();
    const deviceKeys = Object.keys(dto.measuringLogs);

    const [datasource, systemDevices] = await Promise.all([
      this.getDatasource(datasourceKey),
      this.systemRepo.findSystemDevicesByKeys(deviceKeys),
    ]);

    const devices = await this.getNewDevices(datasource, deviceKeys)

    this.datasourceService.mappingSystemKey(devices, systemDevices);
    datasource.updateDevices(devices);

    await Promise.all([
      this.datasourceRepo.save(datasource),
      this.updateConnections(datasource),
    ])
  }

  async updateConnections(datasource: Datasource){
    const list = await this.connectionRepo.findConnectionByDatasourceId(datasource.datasourceId);
    const promises = list.map(connection => {
      const items = this.getConnectionItems(connection, datasource.devices);
      connection.updateItems(items);
      return this.connectionRepo.save(connection)
    })

    return Promise.all(promises)
  }

  getConnectionItems(connection: Connection, devices: Devices) {
    const list = devices.getItems().map(device => {
      return ConnectionItem.create({
        connectionId: connection.connectionId,
        datasourceId: device.datasourceId,
        deviceKey: device.key,
        systemKey: device.systemKey
      }).getValue()
    })
    return ConnectionItems.create(list).getValue()
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
      const deviceResult = Device.create({key: keyResult.getValue(), datasourceId})
      return deviceResult.getValue()
    })

    return Devices.create(listDevice).getValue()
  }
}
