import {AggregateRoot, Guard, Result, UniqueEntityID} from "@iot-platforms/core";
import {ConnectionId} from "./connectionId";
import {ConnectionItems} from "./connectionItems";
import {DatasourceId} from "./datasourceId";
import {StationId} from "./stationId";

export interface ConnectionProps {
  stationId: StationId,
  datasourceIds?: DatasourceId[],
  items?: ConnectionItems,
}

export class Connection extends AggregateRoot<ConnectionProps> {
  get connectionId (){
    return ConnectionId.create(this.id).getValue()
  }

  get stationId (){
    return this.props.stationId
  }

  get datasourceIds (){
    return this.props.datasourceIds
  }

  get items (){
    return this.props.items
  }

  private constructor(props: ConnectionProps, id?: UniqueEntityID){
    super(props, id)
  }

  updateItems(items: ConnectionItems) {
    this.props.items = items;
    const datasourceIdMap = new Map(items.getItems().map(item => [item.datasourceId.value, item.datasourceId]));
    this.props.datasourceIds = [...datasourceIdMap].map(item => item[1]);
  }

  static create(props: ConnectionProps, id?: UniqueEntityID): Result<Connection>{
    const guardResult = Guard.againstNullOrUndefinedBulk([
      {argument: props.stationId, argumentName: 'stationId'},
      {argument: props.datasourceIds, argumentName: 'datasourceIds'},
    ])

    if (guardResult.isFailure) return Result.fail(guardResult.getError());

    const guardDatasourceIdsResult = Guard.againstEmpty(props.datasourceIds, 'datasourceIds')
    if (guardDatasourceIdsResult.isFailure) return Result.fail(guardDatasourceIdsResult.getError());

    const defaultValues: ConnectionProps = {
      ...props,
      items: props.items ?? ConnectionItems.create([]).getValue()
    };

    return Result.ok(new Connection(defaultValues, id))
  }
}
