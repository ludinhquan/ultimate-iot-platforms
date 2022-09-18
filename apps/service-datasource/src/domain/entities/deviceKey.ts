import {Guard, Result, ValueObject} from "@iot-platforms/core";

interface DeviceKeyProps {
  value: string;
}

export class DeviceKey extends ValueObject<DeviceKeyProps> {

  get value (): string {
    return this.props.value;
  }

  private constructor (props: DeviceKeyProps) {
    super(props);
  }

  public static create (props: DeviceKeyProps): Result<DeviceKey> {
    const nullGuardResult = Guard.againstNullOrUndefined(props.value, 'datasourceKey');

    if (nullGuardResult.isFailure) return Result.fail(nullGuardResult.getError());


    return Result.ok<DeviceKey>(new DeviceKey(props));
  }
}
