import {AggregateRoot, Guard, Result, UniqueEntityID} from "@iot-platforms/core";
import {DatasourceId} from "./datasourceId";
import {DatasourceKey} from './datasourceKey'
import {DatasourceType} from "./datasourceType";
import {Devices} from "./devices";

export interface DatasourceProps {
  key: DatasourceKey,
  type?: DatasourceType,
  devices?: Devices,
  totalDevice?: number
}

export class Datasource extends AggregateRoot<DatasourceProps> {
  static defaultType = DatasourceType.Datalogger
  private static readonly initialTotalDevice = 0;
  
  get datasourceId(): DatasourceId {
    return DatasourceId.create(this._id).getValue()
  }

  get key(){
    return this.props.key
  }

  get type(){
    return this.props.type
  }

  get devices(){
    return this.props.devices
  }

  get totalDevice(){
    return this.props.totalDevice
  }
  

  private constructor(props: DatasourceProps, id?: UniqueEntityID){
    super(props, id)
  }

  public updateDevices(devices: Devices){
    this.props.devices = devices
  }

  public updateTotalDevice(total: number){
    this.props.totalDevice = total
  }

  static create(props: DatasourceProps, id?: UniqueEntityID): Result<Datasource>{
    const guardResult = Guard.againstNullOrUndefinedBulk([
      {argument: props.key, argumentName: 'datasourceKey'},
    ])

    if (guardResult.isFailure) {
      return Result.fail(guardResult.getError());
    }


    const defaultValues: DatasourceProps = {
      ...props,
      totalDevice: props.totalDevice ?? this.initialTotalDevice,
      type: props.type ? props.type : Datasource.defaultType
    }

    return Result.ok(new Datasource(defaultValues, id))
  }
}
