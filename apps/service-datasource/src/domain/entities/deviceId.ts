import {Entity, Result, UniqueEntityID} from "@iot-platforms/core";

export class DeviceId extends Entity<any> {

  get value () {
    return this.getValue<string>();
  }

  private constructor (id?: UniqueEntityID) {
    super(null, id)
  }

  public static create (id?: UniqueEntityID): Result<DeviceId> {
    return Result.ok<DeviceId>(new DeviceId(id));
  }
}
