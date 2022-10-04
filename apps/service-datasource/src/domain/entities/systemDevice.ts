import {Entity, Result, UniqueEntityID} from "@iot-platforms/core";
import {SystemDeviceKey} from "./systemDeviceKey";

type SystemDeviceProps = {
  key: SystemDeviceKey,
  name: string,
  unit: string
}

export class SystemDevice extends Entity<SystemDeviceProps>{
  get key(){
    return this.props.key
  }
  get name(){
    return this.props.name
  }
  get unit(){
    return this.props.unit
  }

  private constructor(props: SystemDeviceProps, id?: UniqueEntityID){
    super(props, id)
  }

  static create(props: SystemDeviceProps, id?: UniqueEntityID): Result<SystemDevice>{
    return Result.ok(new SystemDevice(props, id))
  }
}
