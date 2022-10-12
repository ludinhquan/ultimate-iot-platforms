import {ServiceDatasourceRoutes} from "@iot-platforms/common";
import {CurrentOrganization, JwtAuthGuard} from "@iot-platforms/core";
import {UnexpectedError} from "@iot-platforms/core/errors/unexpect.error";
import {Body, Controller, Post, UseGuards} from "@nestjs/common";
import {RepositoryManager} from "@svc-datasource/dataAccess";
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
          case CreateConnectionErrors.CreateConnectionBadRequest:
          case CreateConnectionErrors.DatasourceNotFound:
          case CreateConnectionErrors.DeviceDontMatchWithDatasource:
          default:
            return error
        }
      }
      const connection = result.value.getValue()
      return {connectionId: connection.connectionId.value}
    } catch (e) {
      return new UnexpectedError(e)
    }
  }
}
