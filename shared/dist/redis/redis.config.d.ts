import type { ConfigService } from '@nestjs/config';
import type { RedisModuleOptions } from './redis.interface.js';
export declare const redisOptionsModuleFactory: (config: ConfigService) => RedisModuleOptions;
