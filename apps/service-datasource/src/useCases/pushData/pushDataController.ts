import {CurrentOrganization, JwtAuthGuard} from "@iot-platforms/core";
import {EventBusToken, IEventBus, RawDataReceivedEvent} from "@iot-platforms/event-bus";
import {Body, Controller, Inject, Post, UseGuards} from "@nestjs/common";
import {PushDataDTO} from "./pushDataDTO";

@Controller()
@UseGuards(JwtAuthGuard)
export class PushDataController {
  constructor(
    @Inject(EventBusToken) private eventBus: IEventBus
  ) {}

  @Post('push-data')
  pushData(
    @Body() data: PushDataDTO,
    @CurrentOrganization() organization: IOrganization
  ){
    const event = new RawDataReceivedEvent({
      organizationId: organization.id,
      datasourceKey: data.datasourceKey,
      receivedAt: data.receivedAt,
      measuringLogs: data.measuringLogs
    })
    this.eventBus.publish(event)
  }
}
