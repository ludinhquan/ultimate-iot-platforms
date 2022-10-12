import {IntegrationEvent} from "../abstracts";

type EventProps = {
  organizationId: string,
  connectionId: string,
}

export class ConnectionStateChangedEvent implements IntegrationEvent {
  public readonly organizationId: string

  public readonly connectionId: string

  public readonly dateTimeOccurred: Date

  constructor(props: EventProps) {
    this.organizationId = props.organizationId;
    this.dateTimeOccurred = new Date()
  }

  getAggregateId(): string {
    return this.connectionId
  }

  getOrganizationId(): string {
    return this.organizationId
  }
}
