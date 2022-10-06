import {IRepository} from "@iot-platforms/data-access";
import {Connection} from "../../domain";

export const ConnectionRepository = Symbol('IConnectionRepository');

export interface IConnectionRepository extends IRepository {
  save(connection: Connection): Promise<void>,
}
