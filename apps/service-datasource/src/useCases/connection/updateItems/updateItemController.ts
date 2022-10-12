import {ServiceDatasourceRoutes} from "@iot-platforms/common";
import {CurrentOrganization, JwtAuthGuard} from "@iot-platforms/core";
import {UnexpectedError} from "@iot-platforms/core/errors/unexpect.error";
import {Body, Controller, Post, UseGuards} from "@nestjs/common";
import {RepositoryManager} from "@svc-datasource/dataAccess";
import {UpdateItemsDTO} from "./updateItemsDTO";

@Controller(ServiceDatasourceRoutes.Connection.Root)
@UseGuards(JwtAuthGuard)
export class UpdateItemsController {
  constructor(
    private repoManager: RepositoryManager
  ){ }

  @Post()
  async createConnection(
    @Body() dto: UpdateItemsDTO,
  ){
    try {
      // const [datasourceRepo, connectionRepo] = await Promise.all([
      // ]);
      // return {connectionId: connection.connectionId.value}
    } catch (e) {
      return new UnexpectedError(e)
    }
  }
}
