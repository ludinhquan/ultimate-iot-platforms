import {ConnectionItemStatus} from '@iot-platforms/contracts';
import {Column, Entity} from 'typeorm';
import {BaseEntity} from './base.entity';

@Entity('core.connection-items')
export class ConnectionItemOrmEntity extends BaseEntity {
  @Column()
  datasourceId: string;

  @Column()
  connectionId: string;

  @Column()
  deviceKey: string;

  @Column()
  systemKey: string;

  @Column()
  status: ConnectionItemStatus;

  @Column()
  ratio: number;
}
