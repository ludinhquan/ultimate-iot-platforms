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
    private datasourceService: DatasourceService
  ){}

  @Post('/add-devices')
  async addNewDevices(
    @Body() createDto: AddNewDevicesDTO,
    @CurrentOrganization() tentant: IOrganization
  ){
    const [datasourceRepo, systemDeviceRepo] = await Promise.all([
      this.repoManager.datasourceRepo(tentant.id),
      this.repoManager.systemDeviceRepo(tentant.id)
    ]);

    const useCase = new AddNewDevicesUseCase(datasourceRepo, systemDeviceRepo, this.datasourceService)

    const result = await useCase.execute(createDto);
    if (result.isLeft()) {
      throw result.value
    }
  }
}