import {MeasuringLogs} from "@iot-platforms/contracts";

export interface UpdateDatasourceDTO {
  datasourceKey: string,
  measuringLogs: MeasuringLogs
}
