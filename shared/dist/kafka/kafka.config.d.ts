import type { ConfigService } from '@nestjs/config';
import type { KafkaOptions } from '@nestjs/microservices';
export declare const kafkaOptionsFactory: (config: ConfigService) => KafkaOptions;
