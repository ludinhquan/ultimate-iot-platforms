import {Injectable} from "@nestjs/common";
import {EntityTarget, MongoRepository, ObjectLiteral} from "typeorm";
import {MongoMultiTenantService} from "./databases";
import {DatasourceOrmEntity, DeviceOrmEntity} from "./databases/mongo/entities";
import {DeviceRepository} from "./databases/mongo/repositories";
import {DataSourceRepository} from "./databases/mongo/repositories/datasource.repository";
import {IRepo, IRepositoryManager} from "./interfaces";

@Injectable()
export class RepositoryManager implements IRepositoryManager {
  repoMaps: Map<string, IRepo> = new Map()

  constructor(
    private mongoMultiTenantService: MongoMultiTenantService,
  ){ }

  private getRepoToken(tentant: IOrganization, repo: ClassType<IRepo>){
    return [tentant.id, repo.constructor.name].join('_')
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

  async datasourceRepo(
    tentant: IOrganization,
  ): Promise<DataSourceRepository> {
    const tenantId = tentant.id;
    const token = this.getRepoToken(tentant, DataSourceRepository);
    if (!this.repoMaps.has(token)) {
      const datasourceMongoRepo = await this.getRepository(tenantId, DatasourceOrmEntity)
      const deviceRepo = await this.deviceRepo(tentant);
      const repo = new DataSourceRepository(datasourceMongoRepo, deviceRepo)
      this.repoMaps.set(token, repo)
    }
    return this.repoMaps.get(token) as DataSourceRepository
  }

  async deviceRepo(
    tentant: IOrganization,
  ): Promise<DeviceRepository> {
    const tenantId = tentant.id;
    const token = this.getRepoToken(tentant, DataSourceRepository);
    if (!this.repoMaps.has(token)) {
      const deviceRepo = await this.getRepository(tenantId, DeviceOrmEntity)
      const repo = new DeviceRepository(deviceRepo)
      this.repoMaps.set(token, repo)
    }
    return this.repoMaps.get(token) as DeviceRepository
  }
}
