import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { TransactionStatus, TransactionType } from '../transaction.types.js';

const toArray = ({ value }: { value: unknown }): unknown => {
  if (value === undefined || value === null) return value;
  return Array.isArray(value) ? value : [value];
};

export class GetTransactionsFilterDto {
  @ApiProperty({ type: [String], required: false })
  @IsOptional() @Transform(toArray) @IsString({ each: true })
  ids?: string[];

  @ApiProperty({ type: [String], required: false })
  @IsOptional() @Transform(toArray) @IsString({ each: true })
  userIds?: string[];

  @ApiProperty({ type: [String], required: false })
  @IsOptional() @Transform(toArray) @IsString({ each: true })
  amounts?: string[];

  @ApiProperty({ enum: TransactionType, required: false })
  @IsOptional() @IsEnum(TransactionType)
  type?: TransactionType;

  @ApiProperty({ enum: TransactionStatus, required: false })
  @IsOptional() @IsEnum(TransactionStatus)
  status?: TransactionStatus;

  @ApiProperty({ type: Number, required: false })
  @IsOptional() @Type(() => Number) @IsNumber()
  take?: number;

  @ApiProperty({ type: Number, required: false })
  @IsOptional() @Type(() => Number) @IsNumber()
  skip?: number;
}