import {Either, left, Result, right, UniqueEntityID, UseCase} from "@iot-platforms/core";
import {IConnectionRepository, IDataSourceRepository} from "@svc-datasource/data-access";
import {Connection, ConnectionId, ConnectionItem, ConnectionItems, Datasource, DatasourceId, DeviceKey, StationId, SystemDeviceKey} from "@svc-datasource/domain";
import {CreateConnectionDTO} from "./createConnectionDTO";
import {CreateConnectionErrors} from "./createConnectionErrors";

type CreateConnectionResponse = Either<
  CreateConnectionErrors.DeviceKeyIsInvalid |
  CreateConnectionErrors.DatasourcesNotFound |
  Result<any>,
  Result<any>
>

type ValidateDatasourceResult = Either<
  CreateConnectionErrors.DatasourcesNotFound,
  Result<Datasource[]>
>

type ValidateItemsResult = Either<
  CreateConnectionErrors.DatasourcesNotFound |
  CreateConnectionErrors.DeviceDontMatchDatasource |
  Result<any>,
  Result<ConnectionItems>
>

export class CreateConnectionUseCase implements UseCase<CreateConnectionDTO, CreateConnectionResponse> {
  constructor(
    private datasourceRepo: IDataSourceRepository,
    private connectionRepo: IConnectionRepository
  ) {}

  async execute(dto: CreateConnectionDTO): Promise<CreateConnectionResponse> {
    const datasourceIds = dto.datasourceIds
      .map(id => DatasourceId.create(new UniqueEntityID(id)).getValue());

    const connectionOptional = await this.checkConnection(dto);

    const datasourceResults = await this.validateDatasources(datasourceIds);

    if (datasourceResults.isLeft()) return datasourceResults;

    const datasources = datasourceResults.value.getValue()

    const connectionId = ConnectionId.create(connectionOptional?.id).getValue();

    const oldItems = await this.connectionRepo.getItems({connectionId});
    const itemResults = this.validateItems(dto, {datasources, items: oldItems, connectionId});

    if (itemResults.isLeft()) return itemResults

    const connectionItems = (itemResults as ValidateItemsResult).value.getValue() as ConnectionItems;

    const connectionResult = Connection.create({
      stationId: StationId.create(new UniqueEntityID(dto.stationId)).getValue(),
      datasourceIds: datasourceIds,
      items: connectionItems
    }, connectionId?.id)
    
    if (connectionResult.isFailure) left(connectionResult.getError())
    const connection = connectionResult.getValue()

    await this.connectionRepo.save(connection)

    return right(Result.ok(connectionItems))
  }

  async checkConnection(dto: CreateConnectionDTO): Promise<Connection | null> {
    const connection = await this.connectionRepo.findOne({stationId: StationId.create(new UniqueEntityID(dto.stationId)).getValue()})
    return connection
  }

  validateItems(
    dto: CreateConnectionDTO,
    params: {items: ConnectionItems, datasources: Datasource[], connectionId: ConnectionId}
  ): ValidateItemsResult {

    const {datasources, connectionId, items} = params

    const datasourceMap = new Map(datasources.map(datasource => [datasource.datasourceId.value, datasource]));

    const connectionItemResults = dto.items.map(item => {
      const deviceKeyOrError = DeviceKey.create({value: item.deviceKey})
      if (deviceKeyOrError.isFailure) return left(deviceKeyOrError)

      let systemKeyOrError: Result<SystemDeviceKey> | null = null
      if (item.systemKey) {
        systemKeyOrError = SystemDeviceKey.create({value: item.systemKey})
        if (systemKeyOrError.isFailure) return left(systemKeyOrError)
      }

      if (!datasourceMap.has(item.datasourceId))
        return left(new CreateConnectionErrors.DatasourcesNotFound(item.datasourceId));

      const datasource = datasourceMap.get(item.datasourceId);
      if (!datasource.devices.exists(item.deviceKey))
        return left(new CreateConnectionErrors.DeviceDontMatchDatasource(item.deviceKey, datasource.datasourceId.value));

      const uniqueKey = [item.deviceKey, item.datasourceId].join();

      const connectionItem = ConnectionItem.create({
        connectionId,
        datasourceId: datasource.datasourceId,
        deviceKey: deviceKeyOrError.getValue(),
        systemKey: systemKeyOrError ? systemKeyOrError.getValue() : null,
        ratio: item.ratio,
        status: item.status
      }, items.get(uniqueKey)?.id)

      if(connectionItem.isFailure) return left(connectionItem.getError())

      return right(connectionItem.getValue())
    })

    const error = connectionItemResults.find(result => result.isLeft());
    if(error) return error as ValidateItemsResult;

    const list = connectionItemResults.map(item => item.value as ConnectionItem);
    const connectionItems = ConnectionItems.create(list);

    if(connectionItems.isFailure) return left(connectionItems);

    return right(connectionItems)
  }

  async validateDatasources(datasourceIds: DatasourceId[]): Promise<ValidateDatasourceResult> {
    const datasources = await this.datasourceRepo.findByIds(datasourceIds);

    const datasourceMap: Map<string, Datasource> = new Map(
      datasources.map(datasource => [datasource.datasourceId.value, datasource])
    )

    const idsNotFound = datasourceIds
      .filter(id => !datasourceMap.has(id.value))
      .map(id => id.value);

    if (idsNotFound.length > 0) return left(new CreateConnectionErrors.DatasourcesNotFound(idsNotFound.join()))

    await this.mapDatasourceDevices(datasources);

    return right(Result.ok(datasources))
  }

  async mapDatasourceDevices(datasources: Datasource[]) {
    const promises = datasources.map(async datasource => {
      const devices = await this.datasourceRepo.getDevicesByDatasourceId(datasource.datasourceId);
      datasource.updateDevices(devices)
    })

    await Promise.all(promises)
  }
}
