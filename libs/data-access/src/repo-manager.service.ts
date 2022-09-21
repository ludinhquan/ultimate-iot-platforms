import {Injectable} from "@nestjs/common";
import {MongoMultiTenantService} from "./databases";
import {DatasourceOrmEntity} from "./databases/mongo/entities";
import {DataSourceRepository} from "./databases/mongo/repositories/datasource.repository";
import {IRepo, IRepositoryManager} from "./interfaces";

@Injectable()
export class RepositoryManager implements IRepositoryManager {
  repoMaps: Map<string, IRepo> = new Map()

  constructor(
    private mongoMultiTenantService: MongoMultiTenantService
  ){ }

  private getRepoToken(tentant: IOrganization, repo: ClassType<IRepo>){
    return [tentant.id, repo.constructor.name].join('_')
  }

  async datasourceRepo(
    tentant: IOrganization
  ): Promise<DataSourceRepository> {
    const token = this.getRepoToken(tentant, DataSourceRepository)
    if (!this.repoMaps.has(token)) {
      const datasource = await this.mongoMultiTenantService.getDatasource(tentant.id);
      const repo = new DataSourceRepository(datasource.getMongoRepository(DatasourceOrmEntity))
      this.repoMaps.set(token, repo)
    }
    return this.repoMaps.get(token) as DataSourceRepository
  }
}
