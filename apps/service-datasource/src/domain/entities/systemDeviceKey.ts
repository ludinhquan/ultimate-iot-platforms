import {Guard, Result, ValueObject} from "@iot-platforms/core";

interface SystemKeyDeviceProps {
  value: string;
}

export class SystemDeviceKey extends ValueObject<SystemKeyDeviceProps> {

  get value (): string {
    return this.props.value;
  }

  private constructor (props: SystemKeyDeviceProps) {
    super(props);
  }

  public static create (props: SystemKeyDeviceProps): Result<SystemDeviceKey> {
    const nullGuardResult = Guard.againstNullOrUndefined(props.value, 'systemKey');

    if (nullGuardResult.isFailure) return Result.fail(nullGuardResult.getError());


    return Result.ok<SystemDeviceKey>(new SystemDeviceKey(props));
  }
}
