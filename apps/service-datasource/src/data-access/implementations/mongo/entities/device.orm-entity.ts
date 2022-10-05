import {Column, Entity} from 'typeorm';
import {BaseEntity} from './base.entity';

@Entity('core.devices')
export class DeviceOrmEntity extends BaseEntity {
  @Column()
  datasourceId: string;

  @Column()
  key: string;

  @Column()
  systemKey: string;

  @Column()
  status?: string;
}
