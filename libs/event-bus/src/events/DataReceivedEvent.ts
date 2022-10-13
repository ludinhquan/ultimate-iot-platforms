import {MeasuringLogs} from "@iot-platforms/contracts";
import {IntegrationEvent} from "../abstracts";


type EventProps = {
  organizationId: string,
  stationId: string,
  receivedAt: string | Date,
  measuringLogs: MeasuringLogs
}

export class DataReceivedEvent implements IntegrationEvent {
  public readonly organizationId: string
  public readonly stationId: string

  public readonly receivedAt: Date
  public readonly measuringLogs: MeasuringLogs

  public readonly dateTimeOccurred: Date

  constructor(props: EventProps) {
    this.receivedAt = typeof props.receivedAt === 'string' ? new Date(props.receivedAt) : props.receivedAt
    this.organizationId = props.organizationId;
    this.stationId = props.stationId;
    this.measuringLogs = props.measuringLogs;
    this.dateTimeOccurred = new Date()
  }

  getAggregateId(): string {
    return this.stationId
  }

  getOrganizationId(): string {
    return this.organizationId
  }
}
