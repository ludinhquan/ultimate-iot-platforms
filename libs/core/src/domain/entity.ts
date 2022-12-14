import {UniqueEntityID} from "./unique-entity-id";

export abstract class Entity<T>{
  private readonly _id: UniqueEntityID;

  protected readonly props:T 

  get id (): UniqueEntityID {
    return this._id;
  }

  static entityId(){}

  getValue<T extends string | number = string>(): T {
    return this._id.toValue() as T;
  }

  constructor(props: T, id: UniqueEntityID){
    this._id = id
    this.props = props
  }

  public equals(o: any): boolean {
    if(o === null || o === undefined || typeof o !== typeof this) return false
    if(this === o) return true;
    return JSON.stringify(this._id) === JSON.stringify(o._id)
  }
} 
