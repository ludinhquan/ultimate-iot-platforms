import {Injectable} from "@nestjs/common";
import {EntityTarget, MongoRepository, ObjectLiteral} from "typeorm";
import {MongoMultiTenantService} from "./databases";
import {DatasourceOrmEntity, DeviceOrmEntity, SystemDeviceOrmEntity} from "./databases/mongo/entities";
import {DeviceRepository, SystemDeviceRepository} from "./databases/mongo/repositories";
import {DataSourceRepository} from "./databases/mongo/repositories/datasource.repository";
import {IRepo, IRepositoryManager} from "./interfaces";

@Injectable()
export class RepositoryManager implements IRepositoryManager {
  repoMaps: Map<string, IRepo> = new Map()

  constructor(
    private mongoMultiTenantService: MongoMultiTenantService,
  ){ }

  private getRepoToken(tenantId: string, repo: ClassType<IRepo>){
    return [tenantId, repo.constructor.name].join('_')
  }

  private async getRepository<Entity extends ObjectLiteral>(tenantId: string, entity: EntityTarget<Entity>): Promise<MongoRepository<Entity>>{
    const datasource = await this.mongoMultiTenantService.getDatasource(tenantId);
    return new Promise(res => {
      const timeInterval = setInterval(() => {
        if(!datasource.hasMetadata(entity)) return
        res(datasource.getMongoRepository(entity));
        clearInterval(timeInterval);
      })
    })
  }

  async datasourceRepo(tenantId: string): Promise<DataSourceRepository> {
    const token = this.getRepoToken(tenantId, DataSourceRepository);
    if (!this.repoMaps.has(token)) {
      const datasourceMongoRepo = await this.getRepository(tenantId, DatasourceOrmEntity)
      const deviceRepo = await this.deviceRepo(tenantId);
      const repo = new DataSourceRepository(datasourceMongoRepo, deviceRepo)
      this.repoMaps.set(token, repo)
    }
    return this.repoMaps.get(token) as DataSourceRepository
  }

  async deviceRepo(tenantId: string): Promise<DeviceRepository> {
    const token = this.getRepoToken(tenantId, DataSourceRepository);
    if (!this.repoMaps.has(token)) {
      const deviceRepo = await this.getRepository(tenantId, DeviceOrmEntity);
      const repo = new DeviceRepository(deviceRepo)
      this.repoMaps.set(token, repo)
    }
    return this.repoMaps.get(token) as DeviceRepository
  }

  async systemDeviceRepo(tenantId: string): Promise<SystemDeviceRepository> {
    const token = this.getRepoToken(tenantId, SystemDeviceRepository);
    if (!this.repoMaps.has(token)) {
      const deviceRepo = await this.getRepository(tenantId, SystemDeviceOrmEntity);
      const repo = new SystemDeviceRepository(deviceRepo)
      this.repoMaps.set(token, repo)
    }
    return this.repoMaps.get(token) as SystemDeviceRepository
  }
}
