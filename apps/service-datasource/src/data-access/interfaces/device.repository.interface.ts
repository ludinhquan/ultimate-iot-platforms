import {IRepository} from "@iot-platforms/data-access";
import {Device, Devices} from "@svc-datasource/domain";

export const DeviceRepository = Symbol('IDeviceRepository');

export interface IDeviceRepository extends IRepository{
  bulkSave(devices: Devices): Promise<boolean>,
  find(device: Partial<Device>): Promise<Devices>
}
