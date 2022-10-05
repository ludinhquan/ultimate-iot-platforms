import {IRepository} from "@iot-platforms/data-access";
import {Device, Devices} from "apps/service-datasource/src/domain";

export interface IDeviceRepository extends IRepository{
  bulkSave(devices: Devices): Promise<boolean>,
  find(device: Partial<Device>): Promise<Devices>
}
