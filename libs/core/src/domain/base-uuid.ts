import {v4, validate} from "uuid";
import {Result} from "../core";
import {Entity} from "./entity";
import {UniqueEntityID} from "./unique-entity-id";

export class BaseUUID extends Entity<any> {
  get value () {
    return this.getValue();
  }

  constructor (id: UniqueEntityID) {
    super(null, id)
  }

  static create<T extends new (...args: any) => InstanceType<T>>(this: T, id?: string | UniqueEntityID): Result<InstanceType<T>> {
    if (id instanceof UniqueEntityID) return Result.ok(new this(id))
    if (!id) return Result.ok(new this(new UniqueEntityID(v4())))

    const isValidUUID = typeof id === 'string' && validate(id);
    if (isValidUUID) return Result.ok(new this(new UniqueEntityID(id)))

    return Result.fail('Invalid UUID format')
  }
}
