import {ErrorsInterceptor, ServiceDatasourceRoutes} from "@iot-platforms/common";
import {CurrentOrganization, JwtAuthGuard} from "@iot-platforms/core";
import {Body, Controller, Post, UseGuards, UseInterceptors} from "@nestjs/common";
import {RepositoryManager} from "@svc-datasource/data-access";
import {CreateDatasourceUseCase} from "./createDatasource";
import {CreateDatasourceDTO} from "./createDatasourceDTO";

@Controller(ServiceDatasourceRoutes.Datasource.Root)
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
    const datasourceRepo = await this.repoManager.datasourceRepo(tentant.id)
    const useCase = new CreateDatasourceUseCase(datasourceRepo)

    const result = await useCase.execute(createDto);
    if (result.isLeft()) {
      throw result.value
    }

    return {datasourceId: result.value.datasourceId.value}
  }
}
