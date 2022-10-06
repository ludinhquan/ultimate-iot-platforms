import {DatasourceType} from '@svc-datasource/domain';
import {Column, Entity} from 'typeorm';
import {BaseEntity} from './base.entity';

@Entity('core.datasources')
export class DatasourceOrmEntity extends BaseEntity {

  @Column()
  type: DatasourceType

  @Column()
  key: string;
}
