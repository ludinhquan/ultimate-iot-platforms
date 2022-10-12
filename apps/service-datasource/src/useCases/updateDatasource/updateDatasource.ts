import {Either, left, Result, UseCase} from "@iot-platforms/core";
import {IConnectionRepository, IDataSourceRepository, ISystemDeviceRepository} from "@svc-datasource/dataAccess";
import {Connection, ConnectionItem, Datasource, DatasourceKey, Device, DeviceKey, Devices, SystemDeviceKey, SystemDevices} from "@svc-datasource/domain";
import {UpdateDatasourceDTO} from "./updateDatasourceDTO";
import {UpdateDatasourceErrors as Errors} from "./updateDatasourceError";

type UpdateDatasourceResponse<T = void> = Either<
  Errors.UpdateDatasourceBadRequest,
  Result<T>
>

export class UpdateDatasourceUseCase implements UseCase<UpdateDatasourceDTO, UpdateDatasourceResponse> {
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

    const devices = await this.transformDevicesFromDTO(dto, {datasource, systemDevices})

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
      connection.addItems(items);
      return this.connectionRepo.save(connection)
    })

    return Promise.all(promises)
  }

  getConnectionItems(connection: Connection, devices: Devices) {
    const list = devices.getItems().map(device => {
      const itemResult = ConnectionItem.create({
        connectionId: connection.connectionId,
        datasourceId: device.datasourceId,
        deviceKey: device.key,
        systemKey: device.systemKey
      })

      return itemResult.getValue()
    })
    return list
  }

  async getDatasource(datasourceKey: DatasourceKey){
    const datasource = await this.datasourceRepo.findByKey(datasourceKey)
    if(!datasource) return Datasource.create({key: datasourceKey}).getValue()
    return datasource
  }

  async transformDevicesFromDTO(
    dto: UpdateDatasourceDTO, 
    params: {datasource: Datasource, systemDevices: SystemDevices}
  ): Promise<Devices> {
    const {datasource, systemDevices} = params
    const datasourceId = datasource.datasourceId
    const oldDevices = await this.datasourceRepo.getDevicesByDatasourceId(datasourceId);

    const listDeviceKeyOrError = Object.keys(dto.measuringLogs)
      .filter(key => !oldDevices.exists(key))
      .map(key => DeviceKey.create({value: key}))
      .filter(deviceKey => deviceKey.isSuccess)

    const listDevice = listDeviceKeyOrError.map(keyResult => {
      const key = keyResult.getValue()
      const systemKey = systemDevices.get(key.value)
      const deviceResult = Device.create({
        datasourceId,
        key: keyResult.getValue(),
        systemKey: SystemDeviceKey.create({value: systemKey?.key.value}).getValue()
      })
      return deviceResult.getValue()
    })

    return Devices.create(listDevice).getValue()
  }
}
