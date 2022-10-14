import {Admin, Consumer, Kafka, Producer} from "kafkajs";
import {IEventBus, IEventHandler, KafkaOptions} from '../../interfaces';
import {IntegrationEvent} from '../../abstracts';
import {EventBusSubscriptionsManager} from "../event-bus.subscriptions-manager";
import {KafkaSingleton} from "./kafka.singleton";
import {Logger} from "@iot-platforms/common";

export class KafkaEventBus implements IEventBus {
  private logger = new Logger(this.constructor.name)
  private client: Kafka
  private admin: Admin
  private producer: Producer
  private consumerMap: Map<string, Consumer> = new Map()

  private readonly eventRegisteredSet: Set<string>
  private readonly handlerRegisteredSet: Set<string>

  private manager = new EventBusSubscriptionsManager()

  constructor(private config: KafkaOptions) {
    this.eventRegisteredSet = new Set((this.config.events ?? []).map(event => event.name));
    this.handlerRegisteredSet = new Set((this.config.handlers ?? []).map(handler => handler.name));
    this.setup()
  }

  private async setup() {
    this.client = KafkaSingleton.getInstance(this.config.options)
    this.admin = this.client.admin()
    this.producer = this.client.producer()
    await this.producer.connect();
  }

  private async getConsumer(event: ClassType<IntegrationEvent>, handler: IEventHandler): Promise<Consumer> {
    const consumerName = handler.constructor.name
    if (this.consumerMap.get(consumerName)) return this.consumerMap.get(consumerName)!;
    const consumer = this.client.consumer({groupId: consumerName});
    consumer.subscribe({topic: event.name, fromBeginning: true})
    await consumer.connect()
    this.consumerMap.set(consumerName, consumer)
    return consumer
  }

  public async register(events: ClassType<IntegrationEvent>[]) {
    await this.admin.createTopics({topics: events.map(item => ({topic: item.name}))})
  }

  async publish(event: IntegrationEvent) {
    const eventName = event.constructor.name;
    if(!this.eventRegisteredSet.has(eventName))
      throw new Error(`Event ${eventName} is not registered in event bus module`)

    await this.producer.send({
      topic: event.constructor.name,
      messages: [{value: event.toString()}],
    })
  }

  async subscribe(event: ClassType<IntegrationEvent>, handler: IEventHandler) {
    const handlerName = handler.constructor.name;
    if(!this.handlerRegisteredSet.has(handlerName)) 
      throw new Error( `Handler ${handlerName} is not registered in event bus module`)

    this.manager.addSubscription(event, handler);
    const consumer = await this.getConsumer(event, handler);
    consumer.run({
      autoCommit: false,
      eachMessage: async (payload) => {
        try {
          const message = payload.message.value?.toString() ?? ''
          const jsonData = JSON.parse(message);
          const data = new event()
          const result = await handler.handle(data, jsonData)
          this.logger.log(`${payload.topic}, ${handler.constructor.name}`)
          if (result.isSuccess) await consumer.commitOffsets([
            {topic: payload.topic, partition: payload.partition, offset: payload.message.offset}
          ])
        } catch (e) {}
      }
    })
  }

  async destroy() {
    await Promise.all([
      this.admin.disconnect(),
      this.producer.disconnect(),
      [...this.consumerMap].map(([consumer]) => this.consumerMap.get(consumer)?.disconnect())
    ])
  }
}
