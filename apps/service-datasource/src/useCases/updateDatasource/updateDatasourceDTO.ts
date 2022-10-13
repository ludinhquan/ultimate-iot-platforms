import {MeasuringLogs} from "@iot-platforms/contracts";

export interface UpdateDatasourceDTO {
  organizationId: string,
  datasourceKey: string,
  receivedAt: Date,
  measuringLogs: MeasuringLogs
}
