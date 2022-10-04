import {IntegrationEvent} from "../abstracts";

type Measure = {
  parameter?: string
  unit?: string
  value: number
  timestamp?: string
  statusDevice: number
}

type EventProps = {
  organizationId: string,
  stationId: string,
  receivedAt: string | Date,
  measures: Measure[]
}

export class RawDataReceivedEvent implements IntegrationEvent {
  public readonly organizationId: string
  public readonly stationId: string

  public readonly receivedAt: Date
  public readonly measures: Measure[]

  public readonly dateTimeOccurred: Date

  constructor(props: EventProps) {
    this.receivedAt = typeof props.receivedAt === 'string' ? new Date(props.receivedAt) : props.receivedAt
    this.organizationId = props.organizationId;
    this.stationId = props.stationId;
    this.measures = props.measures;
    this.dateTimeOccurred = new Date()
  }

  getAggregateId(): string {
    return this.stationId
  }

  getOrganizationId(): string {
    return this.organizationId
  }
}
