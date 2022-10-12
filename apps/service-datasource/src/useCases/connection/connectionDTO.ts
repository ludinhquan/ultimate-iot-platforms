import {ConnectionItemStatus} from "@iot-platforms/contracts"
import {IsIn, IsNumber, IsString, IsUUID, ValidateIf} from "class-validator"

export class ConnectionItem {
  @IsString()
  deviceKey: string

  @ValidateIf(o => !!o.systemKey)
  @IsString()
  systemKey: string

  @IsNumber()
  ratio: number

  @IsIn(Object.values(ConnectionItemStatus))
  status: ConnectionItemStatus

  @IsUUID()
  datasourceId: string
}
