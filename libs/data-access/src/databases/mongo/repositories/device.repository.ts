import {IDeviceRepository} from "@iot-platforms/data-access/interfaces/device-repository.interface";
import {Devices} from "apps/service-datasource/src/domain";
import {MongoRepository} from "typeorm";
import {DeviceOrmEntity} from "../entities";

export class DeviceRepository implements IDeviceRepository {
  constructor(
    private repo: MongoRepository<DeviceOrmEntity>,
  ){ }
  
  async bulkSave(devices: Devices) {
    console.log(devices)
    return true
  }
}
