import {CurrentOrganization, JwtAuthGuard} from "@iot-platforms/core";
import {EventBusToken, IEventBus, RawDataReceivedEvent} from "@iot-platforms/event-bus";
import {Body, Controller, Inject, Post, UseGuards} from "@nestjs/common";

type dataDTO = {
  stationId: string,
  receivedAt: string,
  measures: {value: number, statusDevice: number}[]
}

@Controller()
@UseGuards(JwtAuthGuard)
export class PushDataController {
  constructor(
    @Inject(EventBusToken) private eventBus: IEventBus
  ) {}

  @Post('push-data')
  pushData(
    @Body() data: dataDTO,
    @CurrentOrganization() organization: IOrganization
  ){
    const event = new RawDataReceivedEvent({
      organizationId: organization.id,
      stationId: data.stationId,
      receivedAt: data.receivedAt,
      measures: data.measures
    })
    this.eventBus.publish(event)
  }
}
