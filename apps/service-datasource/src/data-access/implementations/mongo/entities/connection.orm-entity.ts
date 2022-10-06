import {Column, Entity} from 'typeorm';
import {BaseEntity} from './base.entity';


@Entity(`core.connections`)
export class ConnectionOrmEntity extends BaseEntity {

  @Column()
  stationId: string

  @Column()
  datasourceIds: string[]
}
