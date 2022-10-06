import {ConnectionItemStatus} from "@iot-platforms/contracts"

interface ConnectionItem {
  deviceKey: string,
  systemKey?: string,
  ratio: number,
  status: ConnectionItemStatus,
  datasourceId: string
}

export interface CreateConnectionDTO {
  stationId: string,
  datasourceIds: string[],
  items: ConnectionItem[]
}
