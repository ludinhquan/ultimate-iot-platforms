import {EventProps, IntegrationEvent} from "./integration.event";

interface DataReceivedEventProps {
  stationId: string,
  receivedAt: string | Date,
  logs: Record<string, {value: number, statusDevice: number}>
}

export class DataReceivedEvent extends IntegrationEvent {
  public readonly aggregateId: string

  public readonly stationId: string

  public readonly receivedAt: string | Date;

  public readonly measuringLogs: DataReceivedEventProps['logs']

  constructor(props: EventProps<DataReceivedEventProps>){
    super(props)
    super.setOrganizationId(props.organizationId)
    this.receivedAt = props.receivedAt;
    this.stationId = props.stationId;
    this.measuringLogs = props.logs
  }

  getAggregateId(): string {
    return this.aggregateId
  }
}
