import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class SignInDto {
  @ApiProperty({
    description: 'Логин',
    type: String,
    required: true,
  })
  @IsNotEmpty({
    message:
      'Поле "login" должно быть заполнено',
  })
  @IsString({
    message:
      'Поле "login" должно быть строкой',
  })
  readonly login: string;

  @ApiProperty({
    description: 'Пароль',
    type: String,
    required: true,
  })
  @IsNotEmpty({
    message:
      'Поле "password" должно быть заполнено',
  })
  @IsString({
    message:
      'Поле "password" должно быть строкой',
  })
  readonly password: string;
}