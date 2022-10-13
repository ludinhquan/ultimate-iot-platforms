import {ServiceDatasourceRoutes} from "@iot-platforms/common";
import {CurrentOrganization, JwtAuthGuard, UnexpectedError} from "@iot-platforms/core";
import {Controller, Get, Query, UseGuards} from "@nestjs/common";
import {ConnectionMapper, RepositoryManager} from "@svc-datasource/dataAccess";
import {GetConnectionDTO} from "./getConnectionDTO";
import {GetConnectionUseCase} from "./getConnectionItems";

@Controller(ServiceDatasourceRoutes.Connection.Root)
@UseGuards(JwtAuthGuard)
export class GetConnectionController {
  constructor(
    private repoManager: RepositoryManager
  ){}

  @Get()
  async getConnection(
    @Query() dto: GetConnectionDTO,
    @CurrentOrganization() organization: IOrganization
  ){
    try {
      const [connectionRepo] = await Promise.all([
        this.repoManager.connectionRepo(organization.id)
      ])
      const useCase = new GetConnectionUseCase(connectionRepo)
      const result = await useCase.execute(dto)
      if (result.isLeft()) return result.value

      const connections = result.value.getValue()
      return connections.map(ConnectionMapper.toPersistence)
    } catch(e){
      return new UnexpectedError(e.message, e.stack)
    }
  }
}

