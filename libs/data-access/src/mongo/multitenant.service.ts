import {Inject, Injectable, Logger, OnApplicationShutdown} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {ObjectId} from "mongodb";
import {DataSource} from "typeorm";
import {DATABASE_ADMIN} from "../constants";
import {OrganizationOrmEntity} from "./entities";

@Injectable()
export class MultiTenantService implements OnApplicationShutdown{
  private logger = new Logger(this.constructor.name)
  private tenantMaps: Map<string, OrganizationOrmEntity> = new Map()
  private datasourceMaps: Map<string, DataSource> = new Map()

  constructor(
    @Inject(DATABASE_ADMIN) private datasourceAdmin: DataSource,
    private configService: ConfigService
  ) {}

  async getDatasource(tenantId: string): Promise<DataSource> {
    return new Promise(async res => {
      const tenant = await this.getTenant(tenantId);
      if (this.datasourceMaps.has(tenantId)) {
        const datasource = this.datasourceMaps.get(tenantId)
        const timeInterval = setInterval(() => {
          if (datasource.isInitialized) {
            clearInterval(timeInterval);
            res(datasource);
          }
        });
      } else {
        const datasource = new DataSource({
          type: 'mongodb',
          url: this.getUrl(tenant)
        })
        this.datasourceMaps.set(tenantId, datasource);
        await datasource.initialize()
        this.logger.log(`Performs connection to database ${tenant.databaseInfo.name} of the tenant ${tenant.name} successfully!`)
        res(datasource)
      }
    })
  }

  private getUrl(tenant: OrganizationOrmEntity) {
    // const {user, pwd: pass, port, name: database} = tenant.databaseInfo
    const {name: database} = tenant.databaseInfo
    let host = tenant.databaseInfo.address

    // "NODE_ENV" and "MONGO_HOST" is used for development purpose
    const isDevelopment = this.configService.get('NODE_ENV') === 'development'
    if (isDevelopment) host = this.configService.get('MONGO_HOST')

    // return `mongodb://${user}:${pass}@${host}:${port}/${database}`
    return host
  }

  async getTenant(tenantId: string): Promise<OrganizationOrmEntity> {
    if (this.tenantMaps.has(tenantId)) return this.tenantMaps.get(tenantId)
    const organizationRepo = this.datasourceAdmin.getRepository(OrganizationOrmEntity);

    const tenant = await organizationRepo.findOne({where: {_id: new ObjectId(tenantId) as unknown as string}})
    if (!tenant) {
      this.logger.error(`Can't find tenant with tenant id ${tenantId}`);
      throw new Error(`Can't find tenant with tenant id ${tenantId}`)
    }
    this.tenantMaps.set(tenantId, tenant);
    return tenant
  }

  async onApplicationShutdown() {
    const destroyPromises = [...this.datasourceMaps]
    .map(([_, datasource]) => {
      if(datasource.isInitialized) 
        return datasource.destroy()
    })

    await Promise.all(destroyPromises)
  }
}
