import {SubscribeOptions} from './interfaces';

export const EventBusHandler = (options: SubscribeOptions) => (
  target: any,
) => {
  Reflect.defineMetadata(EventBusHandler, options, target.prototype);
};
