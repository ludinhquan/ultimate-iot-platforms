import {EventBusHandlerToken} from './event-bus.constant';
import {SubscribeOptions} from './interfaces';

export const EventBusHandler = (options: SubscribeOptions) => (
  target: any,
) => {
  Reflect.defineMetadata(EventBusHandlerToken, options, target.prototype);
};
