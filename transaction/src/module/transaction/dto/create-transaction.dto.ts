import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { TransactionType } from '../transaction.types.js';

export class CreateTransactionDto {
  @ApiProperty({ type: String })
  @Expose() @IsString()
  userId: string;

  @ApiProperty({ type: String })
  @Expose() @IsString()
  amount: string;

  @ApiProperty({ enum: TransactionType })
  @Expose() @IsEnum(TransactionType)
  transactionType: TransactionType;

  @ApiProperty({ required: false, type: String })
  @Expose() @IsOptional() @IsString()
  recipient?: string;
}