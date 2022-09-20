import {Column, Entity} from 'typeorm';
import {BaseEntity} from './base.entity';

interface ConnectionInfo {
  connectionId: string,
  datasourceId: string,
  datasourceKey: string,
  status: string,
  deviceTotal: number,
  deviceTotalConnected: number
}

interface Measure {
  key: string,
  name: string,
  unit: string | null,
  maxLimit?: number,
  minLimit?: number,
  maxTend?: number,
  minTend?: number,
  maxRange?: number,
  minRange?: number,
}

interface MeasureAdvanced {
  key: string,
  name: string,
  unit: string | null,
  functionCalculate: string,
  nameCalculate: string
}

type MeasureValue = {
  [x: string]: {
    value: number,
    statusDevice: number,
  }
}

interface LastLog {
  receivedAt: Date,
  measuringLogs: MeasureValue,
}

@Entity('station-autos')
export class StationOrmEntity extends BaseEntity {
  @Column()
  key: string;

  @Column()
  name: string;

  @Column()
  connection?: ConnectionInfo
  
  @Column()
  lastLog: LastLog | null;

  @Column()
  measuringList: Measure[]

  @Column()
  measuringListAdvanced: MeasureAdvanced[]
}
