import {UniqueEntityID} from "@iot-platforms/core";
import {Connection, DatasourceId, StationId} from "@svc-datasource/domain";
import {ConnectionOrmEntity} from "../entities";

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

  static toPersistence(entity: Connection): ConnectionOrmEntity {
    return {
      _id: entity.connectionId.value,
      stationId: entity.stationId.value,
      datasourceIds: entity.datasourceIds.map(item => item.value),
      updatedAt: new Date(),
    }
  }
}
