import {Guard, Result, ValueObject} from "@iot-platforms/core";

interface SystemKeyProps {
  value: string;
}

export class SystemKey extends ValueObject<SystemKeyProps> {

  get value (): string {
    return this.props.value;
  }

  private constructor (props: SystemKeyProps) {
    super(props);
  }

  public static create (props: SystemKeyProps): Result<SystemKey> {
    const nullGuardResult = Guard.againstNullOrUndefined(props.value, 'systemKey');

    if (nullGuardResult.isFailure) return Result.fail(nullGuardResult.getError());


    return Result.ok<SystemKey>(new SystemKey(props));
  }
}
