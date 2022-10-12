import {MeasuringLogs} from "@iot-platforms/contracts";

export interface UpdateDatasourceDTO {
  datasourceKey: string,
  receivedAt: Date,
  measuringLogs: MeasuringLogs
}
