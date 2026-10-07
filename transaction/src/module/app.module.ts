import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KafkaModule } from '@lab/shared/kafka';

import { databaseOptions } from '../config/database.config.js';
import { TransactionModule } from './transaction/transaction.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: databaseOptions,
    }),
    KafkaModule,
    TransactionModule,
  ],
})
export class TransactionAppModule {}