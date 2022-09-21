import {SERVICE_DATASOURCE} from "@iot-platforms/common/config/serviceDatasourceRoutes";
import {CurrentOrganization, JwtAuthGuard} from "@iot-platforms/core";
import {RepositoryManager} from "@iot-platforms/data-access/repo-manager.service";
import {Controller, Post, UseGuards} from "@nestjs/common";

@Controller(SERVICE_DATASOURCE)
@UseGuards(JwtAuthGuard)
export class CreateDatasourceController {
  constructor(
    private repoManager: RepositoryManager
  ){}

  @Post()
  async createDatasource(
    @CurrentOrganization() organization: IOrganization
  ){
    const datasourceRepo = await this.repoManager.datasourceRepo(organization)

    const datasources = await datasourceRepo.find()
    console.log(datasources)
  }
}
