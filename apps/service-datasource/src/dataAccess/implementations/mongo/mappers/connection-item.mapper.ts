import {UniqueEntityID} from "@iot-platforms/core";
import {ConnectionId, ConnectionItem, DatasourceId, DeviceKey, SystemDeviceKey} from "@svc-datasource/domain";
import {ConnectionItemOrmEntity} from "../entities";

export class ConnectionItemMapper {
  static toDomain(ormEntity: ConnectionItemOrmEntity): ConnectionItem {
    return ConnectionItem.create(
      {
        datasourceId: DatasourceId.create(new UniqueEntityID(ormEntity.datasourceId)).getValue(),
        connectionId: ConnectionId.create(new UniqueEntityID(ormEntity.connectionId)).getValue(),
        deviceKey: DeviceKey.create({value: ormEntity.deviceKey}).getValue(),
        systemKey: SystemDeviceKey.create({value: ormEntity.systemKey}).getValue(),
        status: ormEntity.status,
        ratio: ormEntity.ratio,
      },
      new UniqueEntityID(ormEntity._id))
      .getValue()
  }

  static toPersistence(entity: ConnectionItem): ConnectionItemOrmEntity {
    return {
      _id: entity.connectionItemId.value,
      datasourceId: entity.datasourceId.value,
      connectionId: entity.connectionId.value,
      deviceKey: entity.deviceKey.value,
      systemKey: entity.systemKey.value,
      status: entity.status,
      ratio: entity.ratio
    }
  }
}
