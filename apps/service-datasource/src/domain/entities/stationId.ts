import { ObjectId } from "mongodb";
import {Entity, Result, UniqueEntityID} from "@iot-platforms/core";

export class StationId extends Entity<any> {

  get id (): UniqueEntityID {
    return this._id;
  }

  private constructor (id?: UniqueEntityID) {
    super(null, id)
  }

  public static create (id?: UniqueEntityID): Result<StationId> {
    return Result.ok<StationId>(new StationId(id ?? new UniqueEntityID(new ObjectId().toHexString())));
  }
}
