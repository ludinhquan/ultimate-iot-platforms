import {removeUndefinedProps} from "@iot-platforms/common";
import {Connection, ConnectionId, ConnectionItems} from "@svc-datasource/domain";
import {MongoRepository} from "typeorm";
import {FindConnectionParams, IConnectionItemRepository, IConnectionRepository} from "../../../interfaces";
import {ConnectionOrmEntity} from "../entities";
import {ConnectionMapper} from "../mappers/connection.mapper";

export class ConnectionRepositoryImpl implements IConnectionRepository {
  constructor(
    private repo: MongoRepository<ConnectionOrmEntity>,
    private itemRepo: IConnectionItemRepository
  ){ }

  private buildBasicQuery(connection: Partial<Connection>){
    const query = removeUndefinedProps({
      _id: connection.connectionId?.value,
      stationId: connection.stationId?.value,
    })
    return query
  }

  async save(connection: Connection){
    const rawData = ConnectionMapper.toPersistence(connection)
    const exists = await this.exists(connection.connectionId);
    const isNewConnection = !exists;

    if(isNewConnection) {
      await this.repo.save(rawData)
      await this.itemRepo.bulkSave(connection.items)
      return
    }

    const query = this.buildBasicQuery({connectionId: connection.connectionId})
    await this.repo.updateOne(query, {$set: rawData})
    await this.itemRepo.bulkSave(connection.items)
  }

  async exists(connectionId: ConnectionId): Promise<boolean> {
    const query = this.buildBasicQuery({connectionId})
    const result = await this.repo.findOne(query);
    const found = !!result === true
    return found
  }

  async findOne(connection: Partial<Connection>): Promise<Connection|null> {
    const query = this.buildBasicQuery(connection)
    const result = await this.repo.findOne(query);
    if(!result) return null
    return ConnectionMapper.toDomain(result);
  }


  async find(params: FindConnectionParams): Promise<Connection[]> {
    const {where, relations} = params
    const {datasourceId, connectionId} = where

    const queryConnection: Record<string, object> = {};
    if (datasourceId) queryConnection.datasourceIds = {$elemMatch: {$eq: datasourceId.value}}
    if (connectionId) queryConnection._id = {$eq: connectionId.value}

    const queryConnectionItems: Record<string, object> = {};
    if (datasourceId) queryConnectionItems.datasourceId = datasourceId;
    if (connectionId) queryConnectionItems.connectionId = connectionId;

    const getConnectionItemPromises = () => {
      if (relations.includes('connection-items')) return this.itemRepo.find({where: queryConnectionItems});
      return Promise.resolve([])
    }

    const [list, connectionItems] = await Promise.all([
      this.repo.findBy(queryConnection),
      getConnectionItemPromises()
    ])

    const results = list.map((entity) => {
      const connection = ConnectionMapper.toDomain(entity)
      const items = connectionItems
        .filter(item => item.connectionId.equals(connection.connectionId))
      connection.updateItems(ConnectionItems.create(items).getValue())

      return connection
    })

    return results
  }

  async getConnectionItems(params: Partial<{connectionId: ConnectionId}>): Promise<ConnectionItems> {
    const {connectionId}= params
    const list = await this.itemRepo.find({where: {connectionId}})
    return ConnectionItems.create(list).getValue()
  }
}
