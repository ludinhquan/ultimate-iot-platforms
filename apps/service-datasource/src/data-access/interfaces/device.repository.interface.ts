import {IRepository} from "@iot-platforms/data-access";
import {Device, Devices} from "@svc-datasource/domain";

export const DeviceRepository = Symbol('IDeviceRepository');

export interface IDeviceRepository extends IRepository{
  bulkSave(devices: Devices): Promise<{total: number}>,
  find(device: Partial<Device>): Promise<Devices>
}
