import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KafkaModule } from '@lab/shared/kafka';
import { TransactionEntity } from './entities/transaction.entity.js';
import { TransactionController } from './transaction.controller.js';
import { TransactionKafkaController } from './transaction.kafka-controller.js';
import { TransactionRepository } from './transaction.repository.js';
import { TransactionService } from './transaction.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity]), KafkaModule],
  controllers: [TransactionController, TransactionKafkaController],
  providers: [TransactionService, TransactionRepository],
})
export class TransactionModule {}