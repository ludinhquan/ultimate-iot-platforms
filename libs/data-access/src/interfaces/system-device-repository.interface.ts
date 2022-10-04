import {SystemDevices} from "apps/service-datasource/src/domain";
import {IRepo} from "./base-repository.interface";

export interface ISystemDeviceRepository extends IRepo{
  findSystemDevicesByKeys(keys: string[]): Promise<SystemDevices>
}
