import {Entity, Guard, Result, UniqueEntityID} from "@iot-platforms/core";
import {DatasourceId} from "./datasourceId";
import {DeviceId} from "./deviceId";
import {DeviceKey} from "./deviceKey";
import {SystemDeviceKey} from "./systemDeviceKey";

export interface DeviceProps {
  key: DeviceKey,
  datasourceId: DatasourceId,
  systemKey?: SystemDeviceKey
}

export class Device extends Entity<DeviceProps> {
  get deviceId(): DeviceId {
    return DeviceId.create(this.id).getValue()
  }

  get key() {
    return this.props.key
  }

  get datasourceId() {
    return this.props.datasourceId
  }

  get systemKey() {
    return this.props.systemKey
  }

  private constructor(props: DeviceProps, id: UniqueEntityID){
    super(props, id)
  }

  updateSystemKey(systemKey?: SystemDeviceKey){
    this.props.systemKey = systemKey ?? null
  }


  static create(props: DeviceProps, id?: UniqueEntityID): Result<Device>{
    const guardResult = Guard.againstNullOrUndefinedBulk([
      {argument: props.datasourceId, argumentName: 'datasourceId'},
      {argument: props.key, argumentName: 'deviceKey'},
    ])

    if(guardResult.isFailure) return Result.fail(guardResult.getError())
    if (!props.systemKey) props.systemKey = SystemDeviceKey.create({value: null}).getValue()

    const deviceId = DeviceId.create(id).getValue().id
    return Result.ok(new Device(props, deviceId))
  }
}
