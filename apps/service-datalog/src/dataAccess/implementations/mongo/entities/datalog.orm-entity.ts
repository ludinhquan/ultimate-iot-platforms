import {ObjectId} from 'mongodb';
import {Column, ObjectIdColumn} from 'typeorm';

export class DataLogOrmEntity {
  @ObjectIdColumn()
  _id: ObjectId

  @Column()
  date: Date;

  @Column()
  logs: Object[];
}
