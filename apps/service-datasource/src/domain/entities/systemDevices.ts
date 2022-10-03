import {Entity, UniqueEntityID} from "@iot-platforms/core";
import {SystemDeviceKey} from "./systemDeviceKey";

type SystemDeviceProps = {
  key: SystemDeviceKey,
  name: string,
  unit: string
}

export class SystemDevice extends Entity<SystemDeviceProps>{
  private constructor(props: SystemDeviceProps, id?: UniqueEntityID){
    super(props, id)
  }

  static create(){}
}
