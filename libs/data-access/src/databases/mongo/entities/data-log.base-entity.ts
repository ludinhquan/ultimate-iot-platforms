import {Column} from 'typeorm';
import {BaseEntity} from './base.entity';

export class DataLogOrmEntity extends BaseEntity {
  @Column()
  date: Date;

  @Column()
  logs: Object[];
}
