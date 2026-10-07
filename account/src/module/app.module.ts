import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module.js';
import { UserModule } from './user/user.module.js';
import { RedisModule } from '@lab/shared/redis';
import { KafkaModule } from '@lab/shared/kafka';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    DatabaseModule,
    UserModule,
    RedisModule,
    KafkaModule,
  ],
})
export class AccountAppModule {}