import {ServiceDatasourceRoutes} from "@iot-platforms/common/config/serviceDatasourceRoutes";
import {ErrorsInterceptor} from "@iot-platforms/common/interceptors/error.interceptor";
import {CurrentOrganization, JwtAuthGuard} from "@iot-platforms/core";
import {Body, Controller, Post, UseGuards, UseInterceptors} from "@nestjs/common";
import {RepositoryManager} from "@svc-datasource/data-access/implementations/mongo/repo-manager.service";
import {DatasourceService} from "@svc-datasource/domain";
import {AddNewDevicesUseCase} from "./addNewDevices";
import {AddNewDevicesDTO} from "./addNewDevicesDTO";

@Controller(ServiceDatasourceRoutes.Datasource.Root)
@UseGuards(JwtAuthGuard)
@UseInterceptors(ErrorsInterceptor)
export class DatasourceAddNewDevicesController {
  constructor(
    private repoManager: RepositoryManager,
    private datasourceService: DatasourceService,
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
