import {Result, ValueObject} from "@iot-platforms/core";

interface SystemKeyDeviceProps {
  value: string | null;
}

export class SystemDeviceKey extends ValueObject<SystemKeyDeviceProps> {

  get value (): string {
    return this.props.value;
  }

  private constructor (props: SystemKeyDeviceProps) {
    super(props);
  }

  public static create (props: SystemKeyDeviceProps): Result<SystemDeviceKey> {
    return Result.ok<SystemDeviceKey>(new SystemDeviceKey(props));
  }
}
