import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service.js';
import { CreateTransactionDto } from './dto/create-transaction.dto.js';
import { GetTransactionsFilterDto } from './dto/get-transactions-filter.dto.js';

@Controller()
export class TransactionController {
  constructor(private readonly service: TransactionService) {}

  @Post()
  create(@Body() dto: CreateTransactionDto): Promise<void> {
    return this.service.create(dto);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.service.getOne(id);
  }

  @Get()
  getMany(@Query() query: GetTransactionsFilterDto) {
    return this.service.getMany(query);
  }
}