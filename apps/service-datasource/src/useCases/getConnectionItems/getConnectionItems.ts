import {BaseUUID, Either, Result, right, UnexpectedError, UseCase} from "@iot-platforms/core";
import {IConnectionRepository} from "@svc-datasource/dataAccess";
import {Connection, ConnectionId, DatasourceId} from "@svc-datasource/domain";
import {GetConnectionDTO} from "./getConnectionDTO";

type GetConnectionResponse<T = void> = Either<
  UnexpectedError,
  Result<T>
>

export class GetConnectionUseCase implements UseCase<GetConnectionDTO, GetConnectionResponse<Connection[]>> {
  constructor(
    private connectionRepo: IConnectionRepository
  ){ }

  async execute(dto: GetConnectionDTO): Promise<GetConnectionResponse<Connection[]>> {
    const where: Record<string, BaseUUID> = {}

    if(dto.connectionId) where.connectionId = ConnectionId.create(dto.connectionId).getValue();
    if(dto.datasourceId) where.datasourceId = DatasourceId.create(dto.datasourceId).getValue();

    const connections = await this.connectionRepo.find({where, relations: ['connection-items']});

    return right(Result.ok(connections))
  }
}
