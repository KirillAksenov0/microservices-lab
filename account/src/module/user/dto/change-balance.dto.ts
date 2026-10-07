import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';
import { TransactionType } from '../user.types.js';

export class ChangeBalanceDto {
  @ApiProperty({ description: 'Идентификатор пользователя', type: String })
  @Expose()
  @IsString()
  userId: string;

  @ApiProperty({ description: 'Сумма', type: String })
  @Expose()
  @IsString()
  amount: string;

  @ApiProperty({ description: 'Тип транзакции', enum: TransactionType })
  @Expose()
  @IsEnum(TransactionType)
  transactionType: TransactionType;
}