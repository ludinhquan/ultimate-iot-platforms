import {Entity, Result, UniqueEntityID} from "@iot-platforms/core";

export class ConnectionItemId extends Entity<any> {

  get value () {
    return this.getValue<string>();
  }

  private constructor (id?: UniqueEntityID) {
    super(null, id)
  }

  public static create (id?: UniqueEntityID): Result<ConnectionItemId> {
    return Result.ok<ConnectionItemId>(new ConnectionItemId(id));
  }
}
