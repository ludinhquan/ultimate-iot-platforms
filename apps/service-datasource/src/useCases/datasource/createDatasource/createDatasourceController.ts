import {SERVICE_DATASOURCE} from "@iot-platforms/common/config/serviceDatasourceRoutes";
import {MongoMultiTenantService} from "@iot-platforms/data-access/databases";
import {Body, Controller, Post} from "@nestjs/common";
import {CreateDatasourceDTO} from "./createDatasourceDTO";

@Controller(SERVICE_DATASOURCE)
export class CreateDatasourceController {
  constructor(
    private multitenant: MongoMultiTenantService
  ){}

  @Post()
  createDatasource(
    @Body() data: CreateDatasourceDTO
  ){
    this.multitenant.getDatasource('5eef80119d4f450011c30d59')
    console.log(data)
  }
}
