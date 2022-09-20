import {SERVICE_DATASOURCE} from "@iot-platforms/common/config/serviceDatasourceRoutes";
import {Body, Controller, Post} from "@nestjs/common";
import {CreateDatasourceDTO} from "./createDatasourceDTO";

@Controller(SERVICE_DATASOURCE)
export class CreateDatasourceController {
  constructor(
    // private dal: IData
  ){}

  @Post()
  createDatasource(
    @Body() data: CreateDatasourceDTO
  ){
    console.log(data)
  }
}
