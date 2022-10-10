import {Result, WatchedList} from "@iot-platforms/core";
import {ConnectionItem} from "./connectionItem";

export class ConnectionItems extends WatchedList<ConnectionItem>{
  private constructor(initialConnectionItems: ConnectionItem[]){
    super(initialConnectionItems)
  }

  public static getUniqueField(item: ConnectionItem): string {
    return [item.deviceKey.value, item.datasourceId.value].join()
  }

  public getUniqueField(item: ConnectionItem): string {
    return ConnectionItems.getUniqueField(item)
  }

  compareItems(a: ConnectionItem, b: ConnectionItem): boolean {
    return a.equals(b)
  }

  static create(items?: ConnectionItem[]): Result<ConnectionItems>{
    const deviceKeys = items.map(ConnectionItems.getUniqueField);
    const systemKeys = items.filter(item => item.systemKey).map(item => item.systemKey.value);

    if (deviceKeys.length !== new Set(deviceKeys).size) return Result.fail('device key of one datasource are not allowed to duplicate')
    if (systemKeys.length !== new Set(systemKeys).size) return Result.fail('system key are not allowed to duplicate')

    return Result.ok(new ConnectionItems(items ?? []))
  }
}
