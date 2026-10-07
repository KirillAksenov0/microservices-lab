import type { ClientKafka } from '@nestjs/microservices';
import type { KafkaEvent } from './kafka.interface.js';
export declare class KafkaService {
    private readonly kafkaClient;
    constructor(kafkaClient: ClientKafka);
    produce(event: KafkaEvent<unknown>): Promise<void>;
    subscribeToResponseOf(pattern: string): void;
    connect(): Promise<void>;
}
