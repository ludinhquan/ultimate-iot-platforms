import {IDataSourceRepository} from "./datasource-repository.interface";
import {IDeviceRepository} from "./device-repository.interface";
import {ISystemDeviceRepository} from "./system-device-repository.interface";

export interface IRepositoryManager {
  datasourceRepo(tenantId: string): Promise<IDataSourceRepository>
  deviceRepo(tenantId: string): Promise<IDeviceRepository>
  systemDeviceRepo(tenantId: string): Promise<ISystemDeviceRepository>
}
