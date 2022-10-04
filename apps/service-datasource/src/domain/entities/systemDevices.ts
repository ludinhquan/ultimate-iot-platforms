import {Result, WatchedList} from "@iot-platforms/core";
import {SystemDevice} from "./systemDevice";

export class SystemDevices extends WatchedList<SystemDevice>{
  private constructor (initialDevices: SystemDevice[]) {
    super(initialDevices)
  }
  
  getUniqueField(item: SystemDevice): string {
    return item.key.value
  }

  compareItems(a: SystemDevice, b: SystemDevice): boolean {
    return a.equals(b)
  }

  static create(list?: SystemDevice[]): Result<SystemDevices> {
    const devices = new SystemDevices(list ?? []);
    return Result.ok(devices)
  }
}
