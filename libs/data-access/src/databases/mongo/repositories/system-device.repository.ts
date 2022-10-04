import {ISystemDeviceRepository} from "@iot-platforms/data-access/interfaces";
import {Logger} from "@nestjs/common";
import {SystemDevices} from "apps/service-datasource/src/domain";
import {MongoRepository} from "typeorm";
import {SystemDeviceOrmEntity} from "../entities";
import {SystemDeviceMapper} from "../mappers";

export class SystemDeviceRepository implements ISystemDeviceRepository {
  logger = new Logger(this.constructor.name)

  constructor(
    private repo: MongoRepository<SystemDeviceOrmEntity>,
  ){ }

  async findSystemDevicesByKeys(keys: string[]): Promise<SystemDevices> {
    const list = await this.repo.findBy({key: {$in: keys}})
    return SystemDevices.create(list.map(SystemDeviceMapper.toDomain)).getValue()
  }
}
