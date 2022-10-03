import {SERVICE_DATASOURCE} from "@iot-platforms/common/config/serviceDatasourceRoutes";
import {ErrorsInterceptor} from "@iot-platforms/common/interceptors/error.interceptor";
import {CurrentOrganization, JwtAuthGuard} from "@iot-platforms/core";
import {RepositoryManager} from "@iot-platforms/data-access/repo-manager.service";
import {Body, Controller, Post, UseGuards, UseInterceptors} from "@nestjs/common";
import {CreateDatasourceUseCase} from "./createDatasource";
import {CreateDatasourceDTO} from "./createDatasourceDTO";

@Controller(SERVICE_DATASOURCE)
@UseGuards(JwtAuthGuard)
@UseInterceptors(ErrorsInterceptor)
export class CreateDatasourceController {
  constructor(
    private repoManager: RepositoryManager,
  ){}

  @Post()
  async createDatasource(
    @Body() createDto: CreateDatasourceDTO,
    @CurrentOrganization() tentant: IOrganization
  ){
    const datasourceRepo = await this.repoManager.datasourceRepo(tentant)
    const useCase = new CreateDatasourceUseCase(datasourceRepo)

    const result = await useCase.execute(createDto);
    if (result.isLeft()) {
      throw result.value
    }

    return {datasourceId: result.value.datasourceId.value}
  }
}
