import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AccountModule } from '../internal/account/account.module.js';
import { AuthModule } from './auth/auth.module.js';
import { RedisModule } from '@lab/shared/redis';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    AccountModule,
    AuthModule,
    RedisModule,
  ],
})
export class AuthAppModule {}