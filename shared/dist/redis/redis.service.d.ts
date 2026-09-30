import { Redis } from 'ioredis';
import type { RedisModuleOptions } from './redis.interface.js';
export declare function createRedisConnection(options: RedisModuleOptions): Redis;
