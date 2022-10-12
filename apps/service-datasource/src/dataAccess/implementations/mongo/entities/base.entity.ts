import {Column, ObjectIdColumn} from "typeorm";

export class BaseEntity {
  @ObjectIdColumn({})
  _id: string;

  @Column({default: () => new Date()})
  createdAt?: Date

  @Column({default: () => new Date()})
  updatedAt?: Date
}
