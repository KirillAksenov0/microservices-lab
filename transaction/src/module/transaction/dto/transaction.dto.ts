import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';
import { TransactionStatus, TransactionType } from '../transaction.types.js';

export class TransactionDto {
  @ApiProperty({ type: String }) @Expose() @IsString()
  id: string;

  @ApiProperty({ type: String }) @Expose() @IsString()
  userId: string;

  @ApiProperty({ type: String }) @Expose() @IsString()
  amount: string;

  @ApiProperty({ enum: TransactionType }) @Expose() @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({ enum: TransactionStatus }) @Expose() @IsEnum(TransactionStatus)
  status: TransactionStatus;
}