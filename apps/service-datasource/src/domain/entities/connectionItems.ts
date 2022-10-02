import {WatchedList} from "@iot-platforms/core";
import {ConnectionItem} from "./connectionItem";

export class ConnectionItems extends WatchedList<ConnectionItem>{
  private constructor(initialConnectionItems: ConnectionItem[]){
    super(initialConnectionItems)
  }

  getUniqueField(item: ConnectionItem): string {
    return item.deviceKey.value
  }

  compareItems(a: ConnectionItem, b: ConnectionItem): boolean {
    return a.equals(b)
  }

  static create(items?: ConnectionItem[]){
    return new ConnectionItems(items ?? [])
  }
}
