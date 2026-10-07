import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TransactionService } from './transaction.service.js';
import { EventNameEnum } from './transaction.types.js';
import type { EventBalanceChangedData } from './transaction.types.js';

@Controller()
export class TransactionKafkaController {
  constructor(private readonly service: TransactionService) {}

  @EventPattern(EventNameEnum.BalanceChanged)
  async handleBalanceChanged(@Payload() message: EventBalanceChangedData): Promise<void> {
    await this.service.updateStatus(message);
  }
}