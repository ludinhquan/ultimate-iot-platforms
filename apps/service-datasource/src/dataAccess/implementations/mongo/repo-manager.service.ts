import {IRepository, TypeormHelperService} from "@iot-platforms/data-access";
import {Injectable} from "@nestjs/common";
import {IConnectionItemRepository, IConnectionRepository, IDataSourceRepository, IDeviceRepository, ISystemDeviceRepository} from "../../interfaces";
import {IRepositoryManager} from "../../interfaces/repository-manager.interface";
import {ConnectionItemOrmEntity, ConnectionOrmEntity, DatasourceOrmEntity, DeviceOrmEntity, SystemDeviceOrmEntity} from "./entities";
import {ConnectionItemRepositoryImpl, ConnectionRepositoryImpl, DataSourceRepositoryImpl, DeviceRepositoryImpl, SystemDeviceRepositoryImpl} from "./repositories";

@Injectable()
export class RepositoryManager implements IRepositoryManager {
  repoMaps: Map<string, IRepository> = new Map()

  constructor(
    private typeormHelper: TypeormHelperService,
  ) {}

  async datasourceRepo(tenantId: string): Promise<IDataSourceRepository> {
    const token = this.typeormHelper.getRepoToken(tenantId, DataSourceRepositoryImpl);
    if (!this.repoMaps.has(token)) {
      const datasourceMongoRepo = await this.typeormHelper.getRepository(tenantId, DatasourceOrmEntity)
      const deviceRepo = await this.deviceRepo(tenantId);
      const repo = new DataSourceRepositoryImpl(datasourceMongoRepo, deviceRepo)
      this.repoMaps.set(token, repo)
    }
    return this.repoMaps.get(token) as IDataSourceRepository
  }

  async deviceRepo(tenantId: string): Promise<IDeviceRepository> {
    const token = this.typeormHelper.getRepoToken(tenantId, DataSourceRepositoryImpl);
    if (!this.repoMaps.has(token)) {
      const deviceRepo = await this.typeormHelper.getRepository(tenantId, DeviceOrmEntity);
      const repo = new DeviceRepositoryImpl(deviceRepo)
      this.repoMaps.set(token, repo)
    }
    return this.repoMaps.get(token) as IDeviceRepository
  }

  async systemDeviceRepo(tenantId: string): Promise<ISystemDeviceRepository> {
    const token = this.typeormHelper.getRepoToken(tenantId, SystemDeviceRepositoryImpl);
    if (!this.repoMaps.has(token)) {
      const systemDeviceRepo = await this.typeormHelper.getRepository(tenantId, SystemDeviceOrmEntity);
      const repo = new SystemDeviceRepositoryImpl(systemDeviceRepo)
      this.repoMaps.set(token, repo)
    }
    return this.repoMaps.get(token) as ISystemDeviceRepository
  }

  async connectionItemRepo(tenantId: string): Promise<IConnectionItemRepository> {
    const token = this.typeormHelper.getRepoToken(tenantId, ConnectionItemRepositoryImpl);
    if (!this.repoMaps.has(token)) {
      const mongoRepo = await this.typeormHelper.getRepository(tenantId, ConnectionItemOrmEntity);
      const repo = new ConnectionItemRepositoryImpl(mongoRepo)
      this.repoMaps.set(token, repo)
    }
    return this.repoMaps.get(token) as IConnectionItemRepository
  }

  async connectionRepo(tenantId: string): Promise<IConnectionRepository> {
    const token = this.typeormHelper.getRepoToken(tenantId, ConnectionRepositoryImpl);
    if (!this.repoMaps.has(token)) {
      const mongoRepo = await this.typeormHelper.getRepository(tenantId, ConnectionOrmEntity);
      const itemRepo = await this.connectionItemRepo(tenantId)
      const repo = new ConnectionRepositoryImpl(mongoRepo, itemRepo)
      this.repoMaps.set(token, repo)
    }
    return this.repoMaps.get(token) as IConnectionRepository
  }
}
