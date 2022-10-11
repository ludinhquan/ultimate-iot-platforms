import {ServiceDatasourceRoutes} from "@iot-platforms/common";
import {CurrentOrganization, JwtAuthGuard} from "@iot-platforms/core";
import {AppError} from "@iot-platforms/core/core/app-error";
import {Body, Controller, Post, UseGuards} from "@nestjs/common";
import {RepositoryManager} from "@svc-datasource/data-access";
import {CreateConnectionUseCase} from "./createConnection";
import {CreateConnectionDTO} from "./createConnectionDTO";
import {CreateConnectionErrors} from "./createConnectionErrors";

@Controller(ServiceDatasourceRoutes.Connection.Root)
@UseGuards(JwtAuthGuard)
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
      const [datasourceRepo, connectionRepo] = await Promise.all([
        this.repoManager.datasourceRepo(organization.id),
        this.repoManager.connectionRepo(organization.id)
      ]);
      const useCase = new CreateConnectionUseCase(datasourceRepo, connectionRepo)
      const result = await useCase.execute(dto)

      if (result.isLeft()) {
        const error = result.value
        switch (error.constructor) {
          case CreateConnectionErrors.BadRequest:
          case CreateConnectionErrors.DatasourceNotFound:
          case CreateConnectionErrors.DeviceDontMatchWithDatasource:
          default:
            return error
        }
      }
    } catch (e) {
      return new AppError.UnexpectedError(e)
    }
  }
}
