import {Device, Devices} from "apps/service-datasource/src/domain";
import {IRepo} from "./base-repository.interface";

export interface IDeviceRepository extends IRepo{
  bulkSave(devices: Devices): Promise<boolean>,
  find(device: Partial<Device>): Promise<Devices>
}
