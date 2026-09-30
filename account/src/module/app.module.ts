import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module.js';
import { UserModule } from './user/user.module.js';
import { RedisModule } from '@lab/shared/redis';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    DatabaseModule,
    UserModule,
    RedisModule,
  ],
})
export class AccountAppModule {}