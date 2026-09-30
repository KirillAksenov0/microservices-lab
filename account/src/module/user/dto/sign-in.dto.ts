import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    description: 'Логин пользователя',
    required: true,
    type: String,
  })
  @Expose()
  @IsString()
  login: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    required: true,
    type: String,
  })
  @Expose()
  @IsString()
  password: string;
}