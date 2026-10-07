var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KAFKA_CLIENT } from './kafka.constant.js';
import { KafkaService } from './kafka.service.js';
let KafkaModule = class KafkaModule {
};
KafkaModule = __decorate([
    Module({
        imports: [
            ConfigModule,
            ClientsModule.registerAsync([
                {
                    name: KAFKA_CLIENT,
                    imports: [ConfigModule],
                    inject: [ConfigService],
                    useFactory: (config) => ({
                        transport: Transport.KAFKA,
                        options: {
                            client: {
                                clientId: config.get('KAFKA_CLIENT_ID'),
                                brokers: (config.get('KAFKA_CLIENT_BROKERS') ?? '').split(','),
                            },
                            producer: {
                                allowAutoTopicCreation: true,
                            },
                        },
                    }),
                },
            ]),
        ],
        providers: [KafkaService],
        exports: [KafkaService, ClientsModule],
    })
], KafkaModule);
export { KafkaModule };
//# sourceMappingURL=kafka.module.js.map