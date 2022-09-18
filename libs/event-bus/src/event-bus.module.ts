import {Inject, Module, OnApplicationBootstrap, OnApplicationShutdown} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import {DiscoveryModule, DiscoveryService} from "@nestjs/core";
import {InstanceWrapper} from "@nestjs/core/injector/instance-wrapper";
import {EventBusHandlerToken, EventBusToken} from "./event-bus.constant";
import {EventBusProvider} from "./event-bus.provider";
import {IEventBus, SubscribeOptions} from "./interfaces";

@Module({
  imports: [ConfigModule, DiscoveryModule],
  providers: [EventBusProvider],
  exports: [EventBusProvider],
})
export class EventBusModule implements OnApplicationBootstrap, OnApplicationShutdown {
  constructor(
    @Inject(EventBusToken) private eventBus: IEventBus,
    private discover: DiscoveryService,
  ){}

  async onApplicationBootstrap(){
    const instances = this.discover.getProviders({})
    instances.map((wrapper: InstanceWrapper) => {
      const {instance} = wrapper
      const isHandler = instance instanceof Object && Reflect.hasMetadata(EventBusHandlerToken, instance)
      if (!isHandler) return
      const subscribeOptions: SubscribeOptions = Reflect.getMetadata(EventBusHandlerToken, instance)
      this.eventBus.subscribe(subscribeOptions.event, wrapper.instance);
    });
  }

  async onApplicationShutdown() {
    await this.eventBus.destroy()
  }
}
