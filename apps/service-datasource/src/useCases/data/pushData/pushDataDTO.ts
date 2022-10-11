import {MeasuringLogs} from "@iot-platforms/contracts"
import {IsBoolean, IsDate, IsObject, IsString, MinLength} from "class-validator"

export class PushDataDTO {
  @IsString()
  @MinLength(1)
  datasourceKey: string

  @IsDate()
  receivedAt: string

  @IsObject()
  measuringLogs: MeasuringLogs
}
