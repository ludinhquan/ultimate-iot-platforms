import {ObjectId} from "mongodb";
import {Column, Entity, ObjectIdColumn} from "typeorm";
interface DatabaseInfo {
  name: string,
  user: string,
  pwd: string,
  port: string,
  address: string
}

@Entity('organizations')
export class OrganizationOrmEntity {

  @ObjectIdColumn()
  _id: string

  @Column()
  name: string

  @Column()
  key: string

  @Column()
  databaseInfo: DatabaseInfo
}
