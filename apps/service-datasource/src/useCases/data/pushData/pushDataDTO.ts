import {MeasuringLogs} from "@iot-platforms/contracts"
import {IsDateString, IsObject, IsString, MinLength} from "class-validator"

export class PushDataDTO {
  @IsString()
  @MinLength(1)
  datasourceKey: string

  @IsDateString()
  receivedAt: string

  @IsObject()
  measuringLogs: MeasuringLogs
}
