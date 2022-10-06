import {IRepository} from "@iot-platforms/data-access";
import {SystemDevices} from "apps/service-datasource/src/domain";

export const SystemDeviceRepository = Symbol('ISystemDeviceRepository');

export interface ISystemDeviceRepository extends IRepository{
  findSystemDevicesByKeys(keys: string[]): Promise<SystemDevices>
}
