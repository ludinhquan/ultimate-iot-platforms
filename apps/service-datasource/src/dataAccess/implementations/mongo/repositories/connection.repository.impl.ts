import {removeUndefinedProps} from "@iot-platforms/common";
import {Connection, ConnectionId, ConnectionItem, ConnectionItems, DatasourceId} from "@svc-datasource/domain";
import {MongoRepository} from "typeorm";
import {IConnectionItemRepository, IConnectionRepository} from "../../../interfaces";
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


  async findConnectionByDatasourceId(datasourceId: DatasourceId): Promise<Connection[]> {
    const where = {datasourceIds: {$elemMatch: {$eq: datasourceId.value}}}
    const list = await this.repo.findBy(where)

    return list.map(ConnectionMapper.toDomain)
  }

  async getItems(connection: Partial<Connection>): Promise<ConnectionItems> {
    return this.itemRepo.find({connectionId: connection.connectionId})
  }
}
