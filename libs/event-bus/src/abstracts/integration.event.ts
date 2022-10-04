export interface IntegrationEvent {
  organizationId: string

  dateTimeOccurred: Date;
  getAggregateId (): string;
  getOrganizationId (): string;
}
