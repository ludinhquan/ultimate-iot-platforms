import {UniqueEntityID} from "@iot-platforms/core";
import {Connection, DatasourceId, StationId} from "@svc-datasource/domain";
import {ConnectionItemOrmEntity, ConnectionOrmEntity} from "../entities";
import {ConnectionItemMapper} from "./connection-item.mapper";

export class ConnectionMapper {
  static toDomain(ormEntity: ConnectionOrmEntity): Connection {
    return Connection.create(
      {
        stationId: StationId.create(new UniqueEntityID(ormEntity.stationId)).getValue(),
        datasourceIds: ormEntity.datasourceIds.map(id => DatasourceId.create(new UniqueEntityID(id)).getValue()),
      },
      new UniqueEntityID(ormEntity._id))
      .getValue()
  }

  static toPersistence(entity: Connection): ConnectionOrmEntity & {items?: ConnectionItemOrmEntity[]} {
    return {
      _id: entity.connectionId.value,
      stationId: entity.stationId.value,
      datasourceIds: entity.datasourceIds.map(item => item.value),
      items: entity.items.getItems().map(ConnectionItemMapper.toPersistence),
      updatedAt: new Date(),
    }
  }
}
