import {Injectable} from "@nestjs/common";
import {DataSource, EntitySchema, EntityTarget, InstanceChecker, MongoRepository, ObjectLiteral} from "typeorm";
import {ConnectionMetadataBuilder} from 'typeorm/connection/ConnectionMetadataBuilder';
import {EntityMetadataValidator} from 'typeorm/metadata-builder/EntityMetadataValidator';
import {IRepository} from "../interfaces";
import {MultiTenantService} from "./multitenant.service";

@Injectable()
export class TypeormHelperService {
  constructor(
    private multiTenantService: MultiTenantService,
  ) {}

  public getRepoToken(tenantId: string, repo: ClassType<IRepository>){
    return [tenantId, repo.name].join('_')
  }

  public async getRepository<Entity extends ObjectLiteral>(tenantId: string, entity: EntityTarget<Entity>): Promise<MongoRepository<Entity>>{
    const datasource = await this.multiTenantService.getDatasource(tenantId);
    return new Promise(res => {
      const timeInterval = setInterval(async () => {
        if(datasource.hasMetadata(entity)) res(datasource.getMongoRepository(entity))
        await this.addEntities(datasource, [entity as unknown as EntitySchema])
        res(datasource.getMongoRepository(entity));
        clearInterval(timeInterval);
      })
    })
  }

  async addEntities(dataSource: DataSource, entities: EntitySchema[]) {
    const connectionMetadataBuilder = new ConnectionMetadataBuilder(dataSource);
    const entityMetadataValidator = new EntityMetadataValidator();

    // build entity metadatas
    const entityMetadatas = await connectionMetadataBuilder.buildEntityMetadatas(entities);

    entityMetadatas.forEach((entityMetadata) => {
      if (!dataSource.hasMetadata(entityMetadata.target)) {
        dataSource.entityMetadatas.push(entityMetadata);
      }
    });

    // validate all created entity metadatas to make sure user created entities are valid and correct
    entityMetadataValidator.validateMany(
      entityMetadatas.filter((metadata) => metadata.tableType !== 'view'),
      dataSource.driver
    );

    // set current data source to the entities
    for (let entityMetadata of entityMetadatas) {
      if (InstanceChecker.isBaseEntityConstructor(entityMetadata.target)) {
        entityMetadata.target.useDataSource(dataSource);
      }
    }
  }
}
