import {Entity, Result, UniqueEntityID} from "@iot-platforms/core";

export class ConnectionId extends Entity<any> {

  get id (): UniqueEntityID {
    return this._id;
  }

  private constructor (id?: UniqueEntityID) {
    super(null, id)
  }

  public static create(id?: UniqueEntityID): Result<ConnectionId> {
    return Result.ok<ConnectionId>(new ConnectionId(id));
  }
}