import {IRepository} from "@iot-platforms/data-access";
import {Connection, ConnectionId} from "../../domain";

export const ConnectionRepository = Symbol('IConnectionRepository');

export interface IConnectionRepository extends IRepository {
  save(connection: Connection): Promise<void>,
  exists(connectionId: ConnectionId): Promise<boolean>,
  findOne(connection: Partial<Connection>): Promise<Connection|null>,
}
