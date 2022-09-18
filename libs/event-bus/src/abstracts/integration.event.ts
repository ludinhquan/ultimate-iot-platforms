export type EventProps<T> = T & {organizationId: string, dateOccurred?: string}

export abstract class IntegrationEvent {
  private _organizationId: string

  public dateOccurred: string | Date

  getOrganizationId() {
    return this._organizationId
  }

  public setOrganizationId(organizationId: string) {
    this._organizationId = organizationId
  }

  constructor(props: {dateOccurred?: string | Date}) {
    this.dateOccurred = props.dateOccurred ?? new Date()
  }

  abstract getAggregateId(): string
}
