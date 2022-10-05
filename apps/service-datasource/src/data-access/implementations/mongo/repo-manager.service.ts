import {IRepository, TypeormHelperService} from "@iot-platforms/data-access";
import {Injectable} from "@nestjs/common";
import {DatasourceOrmEntity, DeviceOrmEntity, SystemDeviceOrmEntity} from "./entities";
import {DataSourceRepositoryImpl, DeviceRepositoryImpl, SystemDeviceRepositoryImpl} from "./repositories";

@Injectable()
export class RepositoryManager {
  repoMaps: Map<string, IRepository> = new Map()

  constructor(
    private typeormHelper: TypeormHelperService,
  ) {}

  async datasourceRepo(tenantId: string): Promise<DataSourceRepositoryImpl> {
    const token = this.typeormHelper.getRepoToken(tenantId, DataSourceRepositoryImpl);
    if (!this.repoMaps.has(token)) {
      const datasourceMongoRepo = await this.typeormHelper.getRepository(tenantId, DatasourceOrmEntity)
      const deviceRepo = await this.deviceRepo(tenantId);
      const repo = new DataSourceRepositoryImpl(datasourceMongoRepo, deviceRepo)
      this.repoMaps.set(token, repo)
    }
    return this.repoMaps.get(token) as DataSourceRepositoryImpl
  }

  async deviceRepo(tenantId: string): Promise<DeviceRepositoryImpl> {
    const token = this.typeormHelper.getRepoToken(tenantId, DataSourceRepositoryImpl);
    if (!this.repoMaps.has(token)) {
      const deviceRepo = await this.typeormHelper.getRepository(tenantId, DeviceOrmEntity);
      const repo = new DeviceRepositoryImpl(deviceRepo)
      this.repoMaps.set(token, repo)
    }
    return this.repoMaps.get(token) as DeviceRepositoryImpl
  }

  async systemDeviceRepo(tenantId: string): Promise<SystemDeviceRepositoryImpl> {
    const token = this.typeormHelper.getRepoToken(tenantId, SystemDeviceRepositoryImpl);
    if (!this.repoMaps.has(token)) {
      const systemDeviceRepo = await this.typeormHelper.getRepository(tenantId, SystemDeviceOrmEntity);
      const repo = new SystemDeviceRepositoryImpl(systemDeviceRepo)
      this.repoMaps.set(token, repo)
    }
    return this.repoMaps.get(token) as SystemDeviceRepositoryImpl
  }
}
