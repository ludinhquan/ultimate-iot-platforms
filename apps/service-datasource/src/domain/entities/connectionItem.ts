import {Entity, Guard, Result, UniqueEntityID} from "@iot-platforms/core";
import {ConnectionItemStatus} from "./connectionItemStatus";
import {DeviceKey} from "./deviceKey";
import {SystemKey} from "./systemKey";

export interface ConnectionItemProps {
  deviceKey: DeviceKey,
  systemKey?: SystemKey,
  status?: ConnectionItemStatus
  ratio?: number,
}

export class ConnectionItem extends Entity<ConnectionItemProps> {
  static defaultRatio = 1

  get deviceKey(){
    return this.props.deviceKey
  }

  get systemKey(){
    return this.props.systemKey
  }

  get status(){
    return this.props.status
  }

  get ratio(){
    return this.props.ratio
  }

  private constructor(props: ConnectionItemProps, id?: UniqueEntityID) {
    super(props, id)
  }

  static getStatus(props: ConnectionItemProps): ConnectionItemStatus {
    if (!props.systemKey) return ConnectionItemStatus.Disabled
    return props.status
  }

  static create(props: ConnectionItemProps, id?: UniqueEntityID){
    const guardResult = Guard.againstNullOrUndefinedBulk([
      {argument: props.deviceKey, argumentName: 'deviceKey'},
    ]);

    if(guardResult.isFailure) return Result.fail(guardResult.getError())

    if (props.status) {
      const guardStatusResult = Guard.isOneOf(props.status, Object.values(ConnectionItemStatus), 'connenctionItemStatus')
      if(guardStatusResult.isFailure) return Result.fail(guardStatusResult.getError())
    }

    const status = ConnectionItem.getStatus(props)

    const defaultValues = {
      ...props,
      ratio: ConnectionItem.defaultRatio,
      status
    }
    
    return Result.ok(new ConnectionItem(defaultValues, id))
  }
}
