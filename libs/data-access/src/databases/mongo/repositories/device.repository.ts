import {removeUndefinedProps} from "@iot-platforms/common";
import {IDeviceRepository} from "@iot-platforms/data-access/interfaces/device-repository.interface";
import {Logger} from "@nestjs/common";
import {Device, Devices} from "apps/service-datasource/src/domain";
import {MongoRepository} from "typeorm";
import {DeviceOrmEntity} from "../entities";
import {DeviceMapper} from "../mappers/device.mapper";

export class DeviceRepository implements IDeviceRepository {
  logger = new Logger(this.constructor.name)
  constructor(
    private repo: MongoRepository<DeviceOrmEntity>,
  ){ }
  
  private buildBasicQuery(device: Partial<Device>){
    const query = removeUndefinedProps({
      datasourceId: device.datasourceId?.value,
    })
    return query
  }

  async bulkSave(devices: Devices) {
    const list = devices.getItems().map(DeviceMapper.toPersistence)
    const insertResult = await this.repo.save(list)
    this.logger.log(`Insert ${insertResult.length} devices successfully!`);
    this.logger.debug('Insert devices result:', ...insertResult);
    return true
  }

  async find(device: Partial<Device>): Promise<Devices> {
    const query = this.buildBasicQuery(device)

    const list = await this.repo.find(query)

    return Devices.create(list.map(DeviceMapper.toDomain))
  }
}
