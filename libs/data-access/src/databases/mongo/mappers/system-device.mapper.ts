import {UniqueEntityID} from "@iot-platforms/core";
import {SystemDevice, SystemDeviceKey} from "apps/service-datasource/src/domain";
import {SystemDeviceOrmEntity} from "../entities";

export class SystemDeviceMapper {
  static toDomain(ormEntity: SystemDeviceOrmEntity): SystemDevice {
    return SystemDevice.create(
      {
        key: SystemDeviceKey.create({value: ormEntity.key}).getValue(),
        name: ormEntity.name,
        unit: ormEntity.unit
      },
      new UniqueEntityID(ormEntity._id))
      .getValue()
  }

}
