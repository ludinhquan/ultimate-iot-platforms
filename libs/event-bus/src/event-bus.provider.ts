import {Provider} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {EventBusToken} from "./event-bus.constant";
import {KafkaEventBus, RabbitMQEventBus} from "./implementations";
import {EventBusEnum, IEventBus} from "./interfaces";

export const EventBusProvider: Provider<IEventBus> = {
  provide: EventBusToken,
  useFactory(configService: ConfigService) {
    const type = configService.get('EVENT_BROKER_TYPE');
    switch(type){
      case EventBusEnum.Kafka: return new KafkaEventBus({options: {brokers: [configService.getOrThrow('KAFKA_BROKERS')]}})
      default: return new RabbitMQEventBus({options: configService.getOrThrow('HOST_AMQP_NEW')})
    }
  },
  inject: [ConfigService]
}
