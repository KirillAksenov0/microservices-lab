import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

const toArray = ({ value }: { value: unknown }): unknown => {
  if (value === undefined || value === null) return value;
  return Array.isArray(value) ? value : [value];
};

export default class GetUserFilterDto {
  @ApiProperty({
    description: 'Идентификаторы пользователей',
    type: [String],
    required: false,
    example: ['518f7913-36b8-4c0a-c00f-c742e251acdf'],
  })
  @IsOptional()
  @Transform(toArray)
  @IsString({ each: true })
  readonly userIds?: string[];

  @ApiProperty({
    description: 'Телефоны пользователей',
    type: [String],
    required: false,
    example: ['79001110102', '79001110103'],
  })
  @IsOptional()
  @Transform(toArray)
  @IsString({ each: true })
  readonly phones?: string[];


  @ApiProperty({
    description: 'Количество записей',
    type: Number,
    required: false,
    example: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly take?: number;

  @ApiProperty({
    description: 'Количество пропускаемых записей',
    type: Number,
    required: false,
    example: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly skip?: number;
}