import {Result} from '@iot-platforms/core';
import {IntegrationEvent} from '../abstracts';

export interface IEventHandler<T = IntegrationEvent> {
  handle(event: T, raw: any): Promise<Result<any>>
}
