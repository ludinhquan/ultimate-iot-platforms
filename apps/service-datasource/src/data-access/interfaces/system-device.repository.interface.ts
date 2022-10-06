import {IRepository} from "@iot-platforms/data-access";
import {SystemDevices} from "@svc-datasource/domain";

export const SystemDeviceRepository = Symbol('ISystemDeviceRepository');

export interface ISystemDeviceRepository extends IRepository{
  findSystemDevicesByKeys(keys: string[]): Promise<SystemDevices>
}
