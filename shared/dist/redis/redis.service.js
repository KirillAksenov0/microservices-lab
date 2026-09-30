import { Redis } from 'ioredis';
export function createRedisConnection(options) {
    const { config } = options;
    if (config?.url) {
        return new Redis(config.url, config);
    }
    return new Redis(config);
}
//# sourceMappingURL=redis.service.js.map