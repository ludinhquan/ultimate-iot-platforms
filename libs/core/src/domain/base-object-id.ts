import {ObjectId} from "mongodb";
import {Result} from "../core";
import {Entity} from "./entity";
import {UniqueEntityID} from "./unique-entity-id";

export class BaseObjectID extends Entity<any> {
  get value () {
    return this.getValue();
  }

  get objectId () {
    return new ObjectId(this.getValue())
  }

  constructor (id?: UniqueEntityID) {
    super(null, id)
  }

  static create<T extends new (...args: any) => InstanceType<T>>(this: T, id?: string | UniqueEntityID): Result<InstanceType<T>> {
    if (id instanceof UniqueEntityID) return Result.ok(new this(id))
    if (!id) return Result.ok(new this(new UniqueEntityID(new ObjectId().toHexString())))

    const isValidUUID = ObjectId.isValid(id);
    if (isValidUUID)
      return Result.ok(new this(new UniqueEntityID(id)))

    return Result.fail('Invalid ObjectID format')
  }
}

