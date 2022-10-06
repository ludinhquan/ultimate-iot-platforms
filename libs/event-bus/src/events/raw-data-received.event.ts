import {MeasuringLogs} from "@iot-platforms/contracts";
import {IntegrationEvent} from "../abstracts";


type EventProps = {
  organizationId: string,
  datasourceKey: string,
  receivedAt: string | Date,
  measuringLogs: MeasuringLogs
}

export class RawDataReceivedEvent implements IntegrationEvent {
  public readonly organizationId: string
  public readonly datasourceKey: string

  public readonly receivedAt: Date
  public readonly measuringLogs: MeasuringLogs

  public readonly dateTimeOccurred: Date

  constructor(props: EventProps) {
    this.receivedAt = typeof props.receivedAt === 'string' ? new Date(props.receivedAt) : props.receivedAt
    this.organizationId = props.organizationId;
    this.datasourceKey = props.datasourceKey;
    this.measuringLogs = props.measuringLogs;
    this.dateTimeOccurred = new Date()
  }

  getAggregateId(): string {
    return this.datasourceKey
  }

  getOrganizationId(): string {
    return this.organizationId
  }
}
