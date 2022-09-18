import {Entity, Result, UniqueEntityID} from "@iot-platforms/core";

export class DatasourceId extends Entity<any> {

  get id (): UniqueEntityID {
    return this._id;
  }

  private constructor (id?: UniqueEntityID) {
    super(null, id)
  }

  public static create (id?: UniqueEntityID): Result<DatasourceId> {
    return Result.ok<DatasourceId>(new DatasourceId(id));
  }
}
