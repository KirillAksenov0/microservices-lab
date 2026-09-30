import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisOptionsModuleFactory } from './redis.config.js';
import { createRedisConnection } from './redis.service.js';
import { REDIS_TOKEN } from './redis.constant.js';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: REDIS_TOKEN,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const options = redisOptionsModuleFactory(config);
        return createRedisConnection(options);
      },
    },
  ],
  exports: [REDIS_TOKEN],
})
export class RedisModule {}