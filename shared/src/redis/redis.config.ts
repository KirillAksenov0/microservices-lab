import type { ConfigService } from '@nestjs/config';
import type { RedisModuleOptions } from './redis.interface.js';

export const redisOptionsModuleFactory = (
  config: ConfigService,
): RedisModuleOptions => ({
  config: {
    host: config.get<string>('REDIS_HOST'),
    port: Number(config.get<string>('REDIS_PORT')),
    password: config.get<string>('REDIS_PASSWORD'),
  },
});