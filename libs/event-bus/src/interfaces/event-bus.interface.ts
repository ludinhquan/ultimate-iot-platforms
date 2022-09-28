import {IntegrationEvent} from '../abstracts';
import {IEventHandler} from './handler.interface';

export interface SubscribeOptions {
  event: ClassType<IntegrationEvent>,
  logJsonData?: boolean
}

export interface IEventBus {
  publish(event: IntegrationEvent): Promise<void>;

  subscribe(event: ClassType<IntegrationEvent>, handler: IEventHandler, options?: SubscribeOptions): Promise<void>;

  register(events: ClassType<IntegrationEvent>[]): Promise<void>;

  destroy(): Promise<void>;
}
