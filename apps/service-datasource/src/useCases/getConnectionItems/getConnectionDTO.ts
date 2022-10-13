import {IsUUID, ValidateIf} from "class-validator";

export class GetConnectionDTO {
  @ValidateIf(o => !!o.connectionId)
  @IsUUID()
  connectionId: string

  @ValidateIf(o => !!o.datasourceId)
  @IsUUID()
  datasourceId: string
}
