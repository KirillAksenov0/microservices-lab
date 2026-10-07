import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@lab/shared/redis';

import { KafkaModule } from '@lab/shared/kafka';


import { UserService } from './user.service.js';
import { UserEntity } from './entities/user.entity.js';
import { UserRepository } from './user.repository.js';
import { UserController } from './user.controller.js';
import { UserKafkaController } from './user.kafka-controller.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
    ]),
    RedisModule,
    KafkaModule,
  ],

  providers: [
    UserService,
    UserRepository,
  ],

  controllers: [
    UserController,
    UserKafkaController,
  ],

  exports: [
    UserService,
    UserRepository,
  ]
})
export class UserModule {}
