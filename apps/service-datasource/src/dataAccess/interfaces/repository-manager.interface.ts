import {IConnectionRepository} from "./connection.repository.interface";
import {IDataSourceRepository} from "./datasource.repository.interface";
import {IDeviceRepository} from "./device.repository.interface";
import {ISystemDeviceRepository} from "./system-device.repository.interface";

export interface IRepositoryManager {
  datasourceRepo(tenantId: string): Promise<IDataSourceRepository>
  deviceRepo(tenantId: string): Promise<IDeviceRepository>
  connectionRepo(tenantId: string): Promise<IConnectionRepository>
  systemDeviceRepo(tenantId: string): Promise<ISystemDeviceRepository>
}
