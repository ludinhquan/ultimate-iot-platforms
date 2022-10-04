import {ModuleMetadata} from "@nestjs/common";
import {Options} from "amqplib";
import {KafkaConfig} from 'kafkajs';
import {IntegrationEvent} from "../abstracts";

export enum EventBusEnum {
  Kafka = 'KAFKA',
  RabbitMQ = 'RABBITMQ',
}

export declare type EventBusConfig = KafkaOptions | RmqOptions

export interface KafkaOptions {
  options: KafkaConfig,
}

export interface RmqOptions {
  options: string | Options.Connect
}

export interface EventBusRegisterEvents {
  events?: ClassType<IntegrationEvent>[];
}

export interface EventBusModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  global?: boolean,
  inject?: any[]
  useFactory: (...args: any[]) => EventBusConfig,
}

