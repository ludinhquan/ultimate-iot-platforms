import {ConnectionItemStatus} from "@iot-platforms/contracts"
import {IsNotEmpty, IsString} from "class-validator"

interface ConnectionItem {
  deviceKey: string,
  systemKey?: string,
  ratio: number,
  status: ConnectionItemStatus,
  datasourceId: string
}

export class CreateConnectionDTO {
  @IsNotEmpty()
  @IsString()
  stationId: string

  items: ConnectionItem[]
}
