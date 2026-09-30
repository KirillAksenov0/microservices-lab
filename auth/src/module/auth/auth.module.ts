import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from '@lab/shared/redis';
import { AccountModule } from '../../internal/account/account.module.js';

import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';

@Module({
  imports: [
    AccountModule,
    JwtModule.register({}),
    RedisModule,
  ],

  controllers: [
    AuthController,
  ],

  providers: [
    AuthService,
  ],

  exports: [
    AuthService,
  ],
})
export class AuthModule {}
