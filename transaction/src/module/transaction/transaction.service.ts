import { Injectable } from '@nestjs/common';
import { KafkaService } from '@lab/shared/kafka';
import { TransactionRepository } from './transaction.repository.js';
import { CreateTransactionDto } from './dto/create-transaction.dto.js';
import { GetTransactionsFilterDto } from './dto/get-transactions-filter.dto.js';
import {
  BalanceChangedStatus,
  EventBalanceChangedData,
  EventNameEnum,
  EventTransactionSavedData,
  TransactionStatus,
  TransactionType,
} from './transaction.types.js';

@Injectable()
export class TransactionService {
  constructor(
    private readonly repo: TransactionRepository,
    private readonly kafkaService: KafkaService,
  ) {}

  async create(params: CreateTransactionDto): Promise<void> {
    const { userId, amount, transactionType, recipient } = params;

    if (transactionType === TransactionType.TRANSFER && recipient) {
      await this.createTransferTransaction(params);
      return;
    }

    const transaction = await this.repo.createTransaction({
      userId,
      amount,
      type: transactionType,
    });

    const data: EventTransactionSavedData = {
      userId,
      amount,
      transactionId: transaction.id,
      transactionType,
    };
    await this.kafkaService.produce({
      eventName: EventNameEnum.TransactionSaved,
      data,
    });
  }

  async createTransferTransaction(params: CreateTransactionDto): Promise<void> {
    const { userId, amount, recipient } = params;

    const withdrawal = await this.repo.createTransaction({
      userId,
      amount: `-${amount}`,
      type: TransactionType.WITHDRAWAL,
    });

    await this.kafkaService.produce({
      eventName: EventNameEnum.TransactionSaved,
      data: {
        userId,
        amount,
        transactionId: withdrawal.id,
        transactionType: TransactionType.WITHDRAWAL,
      } as EventTransactionSavedData,
    });

    const deposit = await this.repo.createTransaction({
      userId: recipient!,
      amount,
      type: TransactionType.DEPOSIT,
    });

    await this.kafkaService.produce({
      eventName: EventNameEnum.TransactionSaved,
      data: {
        userId: recipient!,
        amount,
        transactionId: deposit.id,
        transactionType: TransactionType.DEPOSIT,
      } as EventTransactionSavedData,
    });
  }

  async updateStatus(event: EventBalanceChangedData): Promise<void> {
    const status =
      event.status === BalanceChangedStatus.FAILED
        ? TransactionStatus.FAILED
        : TransactionStatus.COMPLETED;

    await this.repo.updateStatus(event.transactionId, status);
  }

  async getOne(id: string) {
    return this.repo.findById(id);
  }

  async getMany(params: GetTransactionsFilterDto) {
    return this.repo.findByParams(params);
  }
}