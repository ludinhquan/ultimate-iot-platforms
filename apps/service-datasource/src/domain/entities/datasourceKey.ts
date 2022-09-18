import {Guard, Result, ValueObject} from "@iot-platforms/core";

interface DatasourceKeyProps {
  value: string;
}

export class DatasourceKey extends ValueObject<DatasourceKeyProps> {

  get value (): string {
    return this.props.value;
  }

  private constructor (props: DatasourceKeyProps) {
    super(props);
  }

  public static create (props: DatasourceKeyProps): Result<DatasourceKey> {
    const nullGuardResult = Guard.againstNullOrUndefined(props.value, 'datasourceKey');

    if (nullGuardResult.isFailure) return Result.fail(nullGuardResult.getError());


    return Result.ok<DatasourceKey>(new DatasourceKey(props));
  }
}
