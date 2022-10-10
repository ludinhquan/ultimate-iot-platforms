import {ErrorsInterceptor, Logger, ServiceDatasourceRoutes} from "@iot-platforms/common";
import {CurrentOrganization, JwtAuthGuard} from "@iot-platforms/core";
import {Body, Controller, HttpException, Post, UseGuards, UseInterceptors} from "@nestjs/common";
import {RepositoryManager} from "@svc-datasource/data-access";
import {CreateConnectionUseCase} from "./createConnection";
import {CreateConnectionDTO} from "./createConnectionDTO";
import {CreateConnectionErrors} from "./createConnectionErrors";

@Controller(ServiceDatasourceRoutes.Connection.Root)
@UseGuards(JwtAuthGuard)
@UseInterceptors(ErrorsInterceptor)
export class CreateConnectionController {
  private logger = new Logger(this.constructor.name)

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
          case CreateConnectionErrors.DatasourcesNotFound:
          case CreateConnectionErrors.DeviceDontMatchDatasource:
          case CreateConnectionErrors.DeviceKeyIsInvalid:
          default:
            throw new HttpException(error.getError(), 422)
        }
      }
    } catch (e) {
      this.logger.error(e)
      throw new HttpException(e, 500)
    }
  }
}
