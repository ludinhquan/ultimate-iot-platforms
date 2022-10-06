import {removeUndefinedProps} from "@iot-platforms/common";
import {Connection, ConnectionId} from "apps/service-datasource/src/domain";
import {MongoRepository} from "typeorm";
import {IConnectionRepository} from "../../../interfaces";
import {ConnectionOrmEntity} from "../entities";
import {ConnectionMapper} from "../mappers/connection.mapper";

export class ConnectionRepositoryImpl implements IConnectionRepository {
  constructor(
    private repo: MongoRepository<ConnectionOrmEntity>
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
      return
    }

    const query = this.buildBasicQuery({connectionId: connection.connectionId})
    await this.repo.updateOne(query, {$set: rawData})
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
}
