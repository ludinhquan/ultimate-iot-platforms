import {AggregateRoot, Guard, Result, UniqueEntityID} from "@iot-platforms/core";
import {ConnectionItems} from "./connectionItems";
import {StationId} from "./stationId";

export interface ConnectionProps {
  stationId: StationId,
  connectionItems?: ConnectionItems
}

export class Connection extends AggregateRoot<ConnectionProps> {
  private constructor(props: ConnectionProps, id?: UniqueEntityID){
    super(props, id)
  }

  static create(props: ConnectionProps, id?: UniqueEntityID): Result<Connection>{
    const guardResult = Guard.againstNullOrUndefinedBulk([
      {argument: props.stationId, argumentName: 'stationId'},
    ])

    if (guardResult.isFailure) {
      return Result.fail(guardResult.getError());
    }

    const defaultValues: ConnectionProps = {
      ...props,
    }

    return Result.ok(new Connection(defaultValues, id))
  }
}
