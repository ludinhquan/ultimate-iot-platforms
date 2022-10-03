import {Entity, Result, UniqueEntityID} from "@iot-platforms/core";

export class DatasourceId extends Entity<any> {

  get value () {
    return this.getValue<string>();
  }

  private constructor (id?: UniqueEntityID) {
    super(null, id)
  }

  public static create (id?: UniqueEntityID): Result<DatasourceId> {
    return Result.ok<DatasourceId>(new DatasourceId(id));
  }
}
