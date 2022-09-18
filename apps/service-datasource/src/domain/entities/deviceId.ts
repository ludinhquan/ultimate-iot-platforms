import {Entity, Result, UniqueEntityID} from "@iot-platforms/core";

export class DeviceId extends Entity<any> {

  get id (): UniqueEntityID {
    return this._id;
  }

  private constructor (id?: UniqueEntityID) {
    super(null, id)
  }

  public static create (id?: UniqueEntityID): Result<DeviceId> {
    return Result.ok<DeviceId>(new DeviceId(id));
  }
}
