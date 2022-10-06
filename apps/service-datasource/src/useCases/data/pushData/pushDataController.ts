import {MeasuringLogs} from "@iot-platforms/contracts";
import {CurrentOrganization, JwtAuthGuard} from "@iot-platforms/core";
import {EventBusToken, IEventBus, RawDataReceivedEvent} from "@iot-platforms/event-bus";
import {Body, Controller, Inject, Post, UseGuards} from "@nestjs/common";

type dataDTO = {
  datasourceKey: string,
  receivedAt: string,
  measuringLogs: MeasuringLogs
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
      datasourceKey: data.datasourceKey,
      receivedAt: data.receivedAt,
      measuringLogs: data.measuringLogs
    })
    this.eventBus.publish(event)
  }
}
