import { Test, TestingModule } from '@nestjs/testing';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

import { TransactionService } from './transaction.service.js';
import { TransactionRepository } from './transaction.repository.js';
import { KafkaService } from '@lab/shared/kafka';
import {
  EventNameEnum,
  TransactionType,
} from './transaction.types.js';
import { CreateTransactionDto } from './dto/create-transaction.dto.js';
import { TransactionEntity } from './entities/transaction.entity.js';

describe('TransactionService', () => {
  let service: TransactionService;
  let repository: TransactionRepository;
  let kafka: KafkaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: TransactionRepository,
          useValue: {
            createTransaction: jest.fn(),
            updateStatus: jest.fn(),
            findById: jest.fn(),
            findByParams: jest.fn(),
          },
        },
        {
          provide: KafkaService,
          useValue: {
            produce: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    repository = module.get<TransactionRepository>(TransactionRepository);
    kafka = module.get<KafkaService>(KafkaService);
  });

  describe('create', () => {
    it('should create transaction and publish event', async () => {
      // Arrange
      const dto: CreateTransactionDto = {
        userId: 'user-1',
        amount: '100',
        transactionType: TransactionType.DEPOSIT,
      };

      const created: TransactionEntity = {
        id: 'tx-1',
        userId: 'user-1',
        amount: '100',
        type: TransactionType.DEPOSIT,
        status: undefined as never,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(repository, 'createTransaction')
        .mockResolvedValue(created);
      jest
        .spyOn(kafka, 'produce')
        .mockResolvedValue(undefined);

      // Act
      await service.create(dto);

      // Assert
      expect(repository.createTransaction).toHaveBeenCalledWith({
        userId: 'user-1',
        amount: '100',
        type: TransactionType.DEPOSIT,
      });

      expect(kafka.produce).toHaveBeenCalledWith({
        eventName: EventNameEnum.TransactionSaved,
        data: {
          userId: 'user-1',
          amount: '100',
          transactionId: 'tx-1',
          transactionType: TransactionType.DEPOSIT,
        },
      });
    });
  });
});