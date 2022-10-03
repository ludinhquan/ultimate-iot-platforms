import {SERVICE_DATASOURCE} from "@iot-platforms/common/config/serviceDatasourceRoutes";
import {ErrorsInterceptor} from "@iot-platforms/common/interceptors/error.interceptor";
import {CurrentOrganization, JwtAuthGuard} from "@iot-platforms/core";
import {RepositoryManager} from "@iot-platforms/data-access/repo-manager.service";
import {Body, Controller, Post, UseGuards, UseInterceptors} from "@nestjs/common";
import {DatasourceService} from "apps/service-datasource/src/domain";
import {AddNewDevicesUseCase} from "./addNewDevices";
import {AddNewDevicesDTO} from "./addNewDevicesDTO";

@Controller(SERVICE_DATASOURCE)
@UseGuards(JwtAuthGuard)
@UseInterceptors(ErrorsInterceptor)
export class DatasourceAddNewDevicesController {
  constructor(
    private repoManager: RepositoryManager,
    private datasourceHelper: DatasourceService
  ){}

  @Post('/add')
  async addNewDevices(
    @Body() createDto: AddNewDevicesDTO,
    @CurrentOrganization() tentant: IOrganization
  ){
    const datasourceRepo = await this.repoManager.datasourceRepo(tentant)
    const useCase = new AddNewDevicesUseCase(datasourceRepo, this.datasourceHelper)

    const result = await useCase.execute(createDto);
    if (result.isLeft()) {
      throw result.value
    }
  }
}
