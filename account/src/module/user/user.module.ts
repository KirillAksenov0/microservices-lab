import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@lab/shared/redis';

import { UserService } from './user.service.js';
import { UserEntity } from './entities/user.entity.js';
import { UserRepository } from './user.repository.js';
import { UserController } from './user.controller.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
    ]),
    RedisModule,
  ],

  providers: [
    UserService,
    UserRepository,
  ],

  controllers: [
    UserController,
  ],

  exports: [
    UserService,
  ]
})
export class UserModule {}
