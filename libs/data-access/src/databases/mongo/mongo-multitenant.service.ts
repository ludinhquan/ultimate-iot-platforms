import {DATABASE_ADMIN} from "@iot-platforms/data-access/constants/shared.constants";
import {Inject, Injectable, Logger} from "@nestjs/common";
import {Datasource} from "apps/service-datasource/src/domain";
import {DataSource} from "typeorm";
import {OrganizationOrmEntity} from "./admin-entities/organization.orm-entity";

@Injectable()
export class MongoMultiTenantService {
  private logger = new Logger(this.constructor.name)
  private tenantMaps: Map<string, OrganizationOrmEntity> = new Map()
  private datasourceMaps: Map<string, Datasource> = new Map()

  constructor(
    @Inject(DATABASE_ADMIN) private datasourceAdmin: DataSource
  ) {}

  async getDatasource(tenantId: string) {}

  async getTenant(tenantId: string): Promise<OrganizationOrmEntity> {
    if(this.tenantMaps.has(tenantId)) return this.tenantMaps.get(tenantId)
    const organizationRepo = this.datasourceAdmin.getRepository(OrganizationOrmEntity);
    
    const tenant = await organizationRepo.findOne({where: {_id: tenantId}})
    if(!tenant) {
      this.logger.error(`Can't find tenant with tenant id ${tenantId}`);
      throw new Error(`Can't find tenant with tenant id ${tenantId}`)
    }
    return tenant
  }
}
