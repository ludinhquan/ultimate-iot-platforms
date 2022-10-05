import {ErrorsInterceptor, ServiceDatasourceRoutes} from "@iot-platforms/common";
import {CurrentOrganization, JwtAuthGuard} from "@iot-platforms/core";
import {Body, Controller, HttpException, Post, UseGuards, UseInterceptors} from "@nestjs/common";
import {RepositoryManager} from "apps/service-datasource/src/data-access";
import {CreateConnectionUseCase} from "./createConnection";
import {CreateConnectionDTO} from "./createConnectionDTO";
import {CreateConnectionErrors} from "./createConnectionErrors";

@Controller(ServiceDatasourceRoutes.Connection.Root)
@UseGuards(JwtAuthGuard)
@UseInterceptors(ErrorsInterceptor)
export class CreateConnectionController {
  constructor(
    private repoManager: RepositoryManager
  ){ }

  @Post()
  async createConnection(
    @Body() dto: CreateConnectionDTO,
    @CurrentOrganization() organization: IOrganization
  ){
    try {
    const [datasourceRepo, systemDeviceRepo] = await Promise.all([
      this.repoManager.datasourceRepo(organization.id),
      this.repoManager.systemDeviceRepo(organization.id)
    ]);
      const useCase = new CreateConnectionUseCase(datasourceRepo)
      const result = await useCase.execute(dto)

      if(result.isLeft()){
        const error = result.value
        if(error instanceof CreateConnectionErrors.DeviceKeyIsInvalid)
          throw error
        throw new HttpException(error.getError(), 422)
      }

    } catch (e) {
      throw new HttpException(e, 500)
    }
  }
}
