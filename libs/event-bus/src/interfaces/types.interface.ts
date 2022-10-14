import {ModuleMetadata} from "@nestjs/common";
import {Options} from "amqplib";
import {KafkaConfig} from 'kafkajs';
import {IntegrationEvent} from "../abstracts";
import {IEventHandler} from "./handler.interface";

export enum EventBusEnum {
  Kafka = 'KAFKA',
  RabbitMQ = 'RABBITMQ',
}

export declare type EventBusConfig = KafkaOptions | RmqOptions

export interface KafkaOptions extends EventBusOptions{
  options: KafkaConfig,
}

export interface RmqOptions extends EventBusOptions {
  options: string | Options.Connect
}

export interface EventBusOptions {
  name: string,
  events?: ClassType<IntegrationEvent>[];
  handlers?: ClassType<IEventHandler>[]
}

export interface EventBusModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  global?: boolean,
  inject?: any[]
  useFactory: (...args: any[]) => EventBusConfig,
}

