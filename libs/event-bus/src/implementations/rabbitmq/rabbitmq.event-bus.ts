import {Logger} from "@iot-platforms/common";
import {Channel, Connection, Options} from "amqplib";
import {IntegrationEvent} from '../../abstracts';
import {IEventBus, IEventHandler, RmqOptions, SubscribeOptions} from '../../interfaces';
import {EventBusSubscriptionsManager} from "../event-bus.subscriptions-manager";
import {RabbitMQSingleton} from "./rabbitmq.singleton";

export class RabbitMQEventBus implements IEventBus {
  private logger = new Logger(this.constructor.name)

  private channel: Channel
  private connection: Connection
  private subscribers: { event: ClassType<IntegrationEvent>, handler: IEventHandler, options?: SubscribeOptions }[] = []
  private manager = new EventBusSubscriptionsManager()

  constructor(
    private config: RmqOptions,
  ) {
    this.setup()
  }

  private async setup(){
    const {options} = this.config
    this.connection = await RabbitMQSingleton.getInstance(options)
    this.channel = await this.connection.createChannel()
 
    while(this.subscribers.length > 0){
      const subscriberParams = this.subscribers.pop()
      if(!subscriberParams) return
      const {event, handler, options} = subscriberParams
      this.addSubscription(event, handler, options)
    }
  }

  private async addSubscription(eventClass: ClassType<IntegrationEvent>, handler: IEventHandler, _?: SubscribeOptions) {
    const exchange = eventClass.name;
    const queueName = [exchange, handler.constructor.name].join('.')
    await this.channel.assertQueue(queueName)
    await this.channel.bindQueue(queueName, exchange, '')

    this.channel.consume(queueName, async (msg) => {
      if (!msg) return
      const jsonData = JSON.parse(msg.content.toString());
      const eventData = new eventClass(jsonData)
      const time = Date.now()
      try {
        const result = await handler.handle(eventData, jsonData)
        this.logger.log(
          `[${handler.constructor.name}] Processing RabbitMQ event: ${eventClass.name} ${eventData.getAggregateId()} +${Date.now() - time}`
        );
        if (result.isSuccess) this.channel.ack(msg)
      } catch (e: any) {
        this.logger.error(e.message)
      }
    })
  }

  public async register(events: ClassType<IntegrationEvent>[]) {
    const timeInterval = setInterval(async () => {
      if (!this.channel) return
      clearInterval(timeInterval)
      await Promise.all(events.map(async event => {
        const exchange = event.name;
        this.logger.log(`Creating RabbitMQ exchange ${exchange}`)
        await this.channel.assertExchange(exchange, 'direct')
      }, 100));
    });
  }

  public async publish(event: IntegrationEvent) {
    const exchange = event.constructor.name
    const basicOptions: Options.Publish = {deliveryMode: 2, mandatory: true}
    this.logger.log(`Publishing event ${exchange} to RabbitMQ with event id ${event.getAggregateId()}`);
    this.channel.publish(exchange, '', Buffer.from(JSON.stringify(event)), basicOptions)
  }

  public async subscribe(event: ClassType<IntegrationEvent>, handler: IEventHandler, options?: SubscribeOptions) {
    this.logger.log(`Subscribing to event ${event.name} with ${handler.constructor.name}`);
    this.manager.addSubscription(event, handler);
    if(!this.channel) {
      this.subscribers.push({event, handler, options});
      return
    }
    this.addSubscription(event, handler, options);
  }

  public async destroy(){
    if(this.channel) await this.channel.close()
    if(this.connection) await this.connection.close()
  }
}
