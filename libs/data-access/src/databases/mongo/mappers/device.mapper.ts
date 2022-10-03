import {UniqueEntityID} from "@iot-platforms/core";
import {DatasourceId, Device, DeviceKey, SystemDeviceKey} from "apps/service-datasource/src/domain";
import {DeviceOrmEntity} from "../entities";

export class DeviceMapper {
  static toDomain(ormEntity: DeviceOrmEntity): Device {
    return Device.create(
      {
        key: DeviceKey.create({value: ormEntity.key}).getValue(),
        datasourceId: DatasourceId.create(new UniqueEntityID(ormEntity.datasourceId)).getValue(),
        systemKey: ormEntity.systemKey ? SystemDeviceKey.create({value: ormEntity.systemKey}).getValue() : null,
      },
      new UniqueEntityID(ormEntity._id))
      .getValue()
  }

  static toPersistence(entity: Device): DeviceOrmEntity {
    return {
      _id: entity.deviceId.value,
      datasourceId: entity.datasourceId.value,
      key: entity.key.value,
      systemKey: entity.systemKey ? entity.systemKey.value : null,
    }
  }
}
