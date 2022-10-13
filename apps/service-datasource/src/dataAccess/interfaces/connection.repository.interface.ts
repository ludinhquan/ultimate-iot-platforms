import {IRepository} from "@iot-platforms/data-access";
import {Connection, ConnectionId, ConnectionItems, DatasourceId} from "../../domain";

export const ConnectionRepository = Symbol('IConnectionRepository');

type Relations = 'connection-items'

export type FindConnectionParams = {
  where: Partial<{datasourceId: DatasourceId, connectionId: ConnectionId}>,
  relations: Relations[]
} 

export interface IConnectionRepository extends IRepository {
  save(connection: Connection): Promise<void>,
  exists(connectionId: ConnectionId): Promise<boolean>,
  findOne(connection: Partial<Connection>): Promise<Connection|null>,
  getConnectionItems(params: Partial<{connectionId: ConnectionId}>): Promise<ConnectionItems>,
  find(params: FindConnectionParams): Promise<Connection[]>,
}
