import {ConnectionItemStatus} from "@iot-platforms/contracts"
import {Type} from "class-transformer"
import {IsIn, IsNotEmpty, IsNumber, IsString, IsUUID, ValidateIf, ValidateNested} from "class-validator"

class ConnectionItem {
  @IsString()
  deviceKey: string

  @ValidateIf(o => !!o.systemKey)
  @IsString()
  systemKey?: string

  @IsNumber()
  ratio: number

  @IsIn(Object.values(ConnectionItemStatus))
  status: ConnectionItemStatus

  @IsUUID()
  datasourceId: string
}

export class CreateConnectionDTO {
  @IsNotEmpty()
  @IsString()
  stationId: string

  @ValidateNested({each: true})
  @Type(() => ConnectionItem)
  items: ConnectionItem[]
}
