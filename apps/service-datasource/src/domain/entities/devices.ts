import {WatchedList} from "@iot-platforms/core";
import {Device} from "./device";

export class Devices extends WatchedList<Device>{
  private constructor (initialDevices: Device[]) {
    super(initialDevices)
  }
  
  getUniqueField(item: Device): string {
    return item.key.value
  }

  compareItems(a: Device, b: Device): boolean {
    return a.equals(b)
  }

  static create(devices?: Device[]){
    return new Devices(devices ?? [])
  }
}
