import {Entity, Result, UniqueEntityID} from "@iot-platforms/core";

export class DatasourceId extends Entity<any> {

  get id (): UniqueEntityID {
    return this._id;
  }

  get value (): number|string {
    return this._id.toValue();
  }

  private constructor (id?: UniqueEntityID) {
    super(null, id)
  }

  public static create (id?: UniqueEntityID): Result<DatasourceId> {
    return Result.ok<DatasourceId>(new DatasourceId(id));
  }
}
