import {IRepository, MultiTenantService, TypeormHelperService} from "@iot-platforms/data-access";
import {Injectable} from "@nestjs/common";
import {EntitySchema, EntityTarget, MongoRepository, ObjectLiteral} from "typeorm";
import {DatasourceOrmEntity, DeviceOrmEntity, SystemDeviceOrmEntity} from "./entities";
import {DataSourceRepositoryImpl, DeviceRepository, SystemDeviceRepository} from "./repositories";

@Injectable()
export class RepositoryManager {
  repoMaps: Map<string, IRepository> = new Map()

  constructor(
    private multiTenantService: MultiTenantService,
    private typeormHelper: TypeormHelperService,
  ) {}

  private getRepoToken(tenantId: string, repo: ClassType<IRepository>){
    return [tenantId, repo.name].join('_')
  }

  private async getRepository<Entity extends ObjectLiteral>(tenantId: string, entity: EntityTarget<Entity>): Promise<MongoRepository<Entity>>{
    const datasource = await this.multiTenantService.getDatasource(tenantId);
    return new Promise(res => {
      const timeInterval = setInterval(async () => {
        if(datasource.hasMetadata(entity)) res(datasource.getMongoRepository(entity))
        await this.typeormHelper.addEntities(datasource, [entity as unknown as EntitySchema])
        res(datasource.getMongoRepository(entity));
        clearInterval(timeInterval);
      })
    })
  }

  async datasourceRepo(tenantId: string): Promise<DataSourceRepositoryImpl> {
    const token = this.getRepoToken(tenantId, DataSourceRepositoryImpl);
    if (!this.repoMaps.has(token)) {
      const datasourceMongoRepo = await this.getRepository(tenantId, DatasourceOrmEntity)
      const deviceRepo = await this.deviceRepo(tenantId);
      const repo = new DataSourceRepositoryImpl(datasourceMongoRepo, deviceRepo)
      this.repoMaps.set(token, repo)
    }
    return this.repoMaps.get(token) as DataSourceRepositoryImpl
  }

  async deviceRepo(tenantId: string): Promise<DeviceRepository> {
    const token = this.getRepoToken(tenantId, DataSourceRepositoryImpl);
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
      const systemDeviceRepo = await this.getRepository(tenantId, SystemDeviceOrmEntity);
      const repo = new SystemDeviceRepository(systemDeviceRepo)
      this.repoMaps.set(token, repo)
    }
    return this.repoMaps.get(token) as SystemDeviceRepository
  }
}
