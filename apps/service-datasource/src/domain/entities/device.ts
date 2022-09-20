import {Entity, Guard, Result, UniqueEntityID} from "@iot-platforms/core";
import {DatasourceId} from "./datasourceId";
import {DeviceId} from "./deviceId";
import {DeviceKey} from "./deviceKey";
import {SystemKey} from "./systemKey";

export interface DeviceProps {
  key: DeviceKey,
  datasourceId?: DatasourceId,
  systemKey?: SystemKey
}

export class Device extends Entity<DeviceProps> {
  get deviceId(): DeviceId{
    return DeviceId.create(this._id).getValue()
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

  private constructor(props: DeviceProps, id?: UniqueEntityID){
    super(props, id)
  }

  updateSystemKey(systemKey: SystemKey){
    this.props.systemKey = systemKey
  }

  updateDatasourceId(datasourceId: DatasourceId){
    this.props.datasourceId = datasourceId
  }

  static create(props: DeviceProps, id?: UniqueEntityID): Result<Device>{
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.key, argumentName: 'deviceKey' },
      { argument: props.datasourceId, argumentName: 'datasourceId' },
    ])

    if(guardResult.isFailure) return Result.fail(guardResult.getError())

    return Result.ok(new Device(props, id))
  }
}
