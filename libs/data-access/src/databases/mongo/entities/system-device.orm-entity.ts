import {Column, Entity} from 'typeorm';
import {BaseEntity} from './base.entity';

@Entity('measurings')
export class SystemDeviceOrmEntity extends BaseEntity {
  @Column()
  key: string;

  @Column()
  name: string;

  @Column()
  unit: string;
}
