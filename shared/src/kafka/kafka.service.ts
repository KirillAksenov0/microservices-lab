import { Inject, Injectable } from '@nestjs/common';
import type { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { KAFKA_CLIENT } from './kafka.constant.js';
import type { KafkaEvent } from './kafka.interface.js';

@Injectable()
export class KafkaService {
  constructor(
    @Inject(KAFKA_CLIENT) private readonly kafkaClient: ClientKafka,
  ) {}

  async produce(event: KafkaEvent<unknown>): Promise<void> {
    const request = this.kafkaClient.emit(event.eventName, event.data);
    await lastValueFrom(request);
  }

  subscribeToResponseOf(pattern: string): void {
    this.kafkaClient.subscribeToResponseOf(pattern);
  }

  async connect(): Promise<void> {
    await this.kafkaClient.connect();
  }
}