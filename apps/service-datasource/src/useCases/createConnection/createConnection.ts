import {Either, left, Result, right, UniqueEntityID, UseCase} from "@iot-platforms/core";
import {IConnectionRepository, IDataSourceRepository} from "@svc-datasource/dataAccess";
import {Connection, ConnectionItem, ConnectionItems, Datasource, DatasourceId, DeviceKey, StationId, SystemDeviceKey} from "@svc-datasource/domain";
import {CreateConnectionDTO} from "./createConnectionDTO";
import {CreateConnectionErrors as Errors} from "./createConnectionErrors";

type CreateConnectionResponse<T = any> = Either<
  Errors.CreateConnectionBadRequest |
  Errors.DatasourceNotFound |
  Errors.DeviceDontMatchWithDatasource,
  Result<T>
>

type ValidateDatasourceResult = CreateConnectionResponse<Datasource[]>
type GetConnectionResult = CreateConnectionResponse<Connection>
type ValidateItemsResult = CreateConnectionResponse<ConnectionItems>

export class CreateConnectionUseCase implements UseCase<CreateConnectionDTO, CreateConnectionResponse> {
  constructor(
    private datasourceRepo: IDataSourceRepository,
    private connectionRepo: IConnectionRepository
  ) {}
  
  async execute(dto: CreateConnectionDTO): Promise<CreateConnectionResponse<Connection>> {
    const datasourceResults = await this.getDatasources(dto);
    if (datasourceResults.isLeft()) return left(datasourceResults.value);

    const datasources = datasourceResults.value.getValue();
    const datasourceIds = datasources.map(datasource => datasource.datasourceId)

    const connectionResult = await this.getConnection(dto, datasourceIds)
    if (connectionResult.isLeft()) return connectionResult;

    const connection = connectionResult.value.getValue();

    const connectionItemResults = await this.getConnectionItems(dto, {connection, datasources})

    if (connectionItemResults.isLeft()) return left(connectionItemResults.value);

    const connectionItems = connectionItemResults.value.getValue();
    connection.updateItems(connectionItems);

    await this.connectionRepo.save(connection);
    
    return right(Result.ok(connection));
  }

  async getConnection(dto: CreateConnectionDTO, datasourceIds: DatasourceId[]): Promise<GetConnectionResult> {
    const stationIdResult = StationId.create(dto.stationId);

    if (stationIdResult.isFailure)
      return left(new Errors.CreateConnectionBadRequest(stationIdResult.getError()))

    const stationId = stationIdResult.getValue()
    const connectionOptional = await this.connectionRepo.findOne({stationId});

    const connectionResult = Connection.create({stationId, datasourceIds}, connectionOptional?.id)
    if(connectionResult.isFailure) return left(new Errors.CreateConnectionBadRequest(connectionResult.getError()))

    return right(connectionResult)
  }

  async checkConnection(dto: CreateConnectionDTO): Promise<Connection | null> {
    const connection = await this.connectionRepo.findOne({stationId: StationId.create(new UniqueEntityID(dto.stationId)).getValue()})
    return connection
  }

  async getConnectionItems(
    dto: CreateConnectionDTO,
    params: {datasources: Datasource[], connection: Connection}
  ): Promise<ValidateItemsResult> {

    const {datasources, connection} = params
    const items = await this.connectionRepo.getConnectionItems({connectionId: connection.connectionId})

    const datasourceMap = new Map(datasources.map(datasource => [datasource.datasourceId.value, datasource]));

    const connectionItemResults: CreateConnectionResponse<ConnectionItem>[] =
      dto.items.map(item => {
        const deviceKeyResult = DeviceKey.create({value: item.deviceKey})
        if (deviceKeyResult.isFailure)
          return left(new Errors.CreateConnectionBadRequest(deviceKeyResult.getError()))

        const systemKeyResult = SystemDeviceKey.create({value: item.systemKey})
        if (systemKeyResult.isFailure)
          return left(new Errors.CreateConnectionBadRequest(systemKeyResult.getError()))

        const datasource = datasourceMap.get(item.datasourceId);
        if (!datasource.devices.exists(item.deviceKey))
          return left(new Errors.DeviceDontMatchWithDatasource(item.deviceKey, datasource.datasourceId.value));

        const uniqueKey = [item.deviceKey, item.datasourceId].join();
        const connectionItem = ConnectionItem.create({
          connectionId: connection.connectionId,
          datasourceId: datasource.datasourceId,
          deviceKey: deviceKeyResult.getValue(),
          systemKey: systemKeyResult.getValue(),
          ratio: item.ratio,
          status: item.status
        }, items.get(uniqueKey)?.id)

        if (connectionItem.isFailure)
          return left(new Errors.CreateConnectionBadRequest(connectionItem.getError()))

        return right(Result.ok(connectionItem.getValue()))
      })

    const error = connectionItemResults.find(result => result.isLeft());
    if (error && error.isLeft()) return left(error.value)

    const list = connectionItemResults.map(item => (item.value as Result<ConnectionItem>).getValue());
    const connectionItemResult = ConnectionItems.create(list);

    if (connectionItemResult.isFailure) return left(new Errors.CreateConnectionBadRequest(connectionItemResult.getError()));

    return right(connectionItemResult)
  }

  transformDatasourceIdsFromDTO(dto: CreateConnectionDTO): Result<DatasourceId[]> {
    const datasourceIdSet = new Set(dto.items.map(item => item.datasourceId))
    const datasourceIdResults = [...datasourceIdSet].map(id => DatasourceId.create(id));
    const combineDatasourceId = Result.combine(datasourceIdResults);

    if(combineDatasourceId.isFailure) return Result.fail(combineDatasourceId.getError())

    return Result.ok(datasourceIdResults.map(item => item.getValue()))
  }

  async getDatasources(dto: CreateConnectionDTO): 
    Promise<ValidateDatasourceResult> {
    const datasourceIdResults = this.transformDatasourceIdsFromDTO(dto);
    if(datasourceIdResults.isFailure) 
      return left(new Errors.CreateConnectionBadRequest(datasourceIdResults.getError<string>()))

    const datasourceIds = datasourceIdResults.getValue();
    const datasources = await this.datasourceRepo.findByIds(datasourceIds);

    const datasourceMap: Map<string, Datasource> = new Map(
      datasources.map(datasource => [datasource.datasourceId.value, datasource])
    )

    const ids = datasourceIds
      .filter(id => !datasourceMap.has(id.value))
      .map(id => id.value)
      .join()
    const notFoundDatasource = !!ids

    if (notFoundDatasource) 
      return left(new Errors.DatasourceNotFound(ids))

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
